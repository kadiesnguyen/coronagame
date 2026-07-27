"use strict";
const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");
const NguoiDung = require("../../models/NguoiDung");
const LienKetNganHang = require("../../models/LienKetNganHang");
const LichSuNap = require("../../models/LichSuNap");

const BienDongSoDu = require("../../models/BienDongSoDu");
const bcrypt = require("bcryptjs");
const catchAsync = require("../../utils/catch_async");
const _ = require("lodash");
const { OkResponse } = require("../../utils/successResponse");
const { MIN_LENGTH_PASSWORD, USER_ROLE } = require("../../configs/user.config");
const UserSocketService = require("../../services/user.socket.service");
const BienDongSoDuServiceFactory = require("../../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../../configs/balance.fluctuation.config");
const { LOAI_DEPOSIT, STATUS_DEPOSIT } = require("../../configs/deposit.config");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const { convertMoney } = require("../../utils/convertMoney");

class UserAdminController {
  static getDanhSachNganHangUser = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const results = await LienKetNganHang.find({ nguoiDung: userId }).select("-__v").sort("-_id").lean();

    return new OkResponse({
      data: results,
    }).send(res);
  });
  static updateNganHangUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { tenNganHang, tenChuTaiKhoan, soTaiKhoan, bankCode } = req.body;
    if (!tenNganHang?.trim() || !tenChuTaiKhoan?.trim() || !soTaiKhoan?.trim()) {
      throw new BadRequestError("Vui lòng nhập đầy đủ thông tin ngân hàng");
    }
    const updatePayload = {
      tenNganHang: tenNganHang.trim(),
      tenChuTaiKhoan: tenChuTaiKhoan.trim(),
      soTaiKhoan: soTaiKhoan.trim(),
    };
    if (bankCode !== undefined) {
      updatePayload.bankCode = String(bankCode || "").trim();
    }
    const bank = await LienKetNganHang.findOneAndUpdate({ _id: id }, updatePayload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!bank) {
      throw new BadRequestError("Không tìm thấy tài khoản ngân hàng");
    }
    return new OkResponse({
      data: bank,
      message: "Cập nhật tài khoản ngân hàng thành công",
    }).send(res);
  });
  static getChiTietUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await NguoiDung.findOne({ _id: id }).select("-__v -matKhau -refreshToken -refreshTokenUsed").lean();
    return new OkResponse({
      data: result,
    }).send(res);
  });
  static updateMoneyUser = catchAsync(async (req, res, next) => {
    // ponytail: Mongo standalone — no multi-doc transactions; use isProcessing lock only.
    const { userId, moneyUpdate, noiDung } = req.body;
    const money = Number(moneyUpdate);
    const note = typeof noiDung === "string" ? noiDung.trim() : "";

    if (!userId || !_.isFinite(money) || money === 0) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }

    const findUser = await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
        isProcessing: { $ne: true },
      },
      { $set: { isProcessing: true, lockTimestamp: Date.now() } },
      { new: true }
    );
    if (!findUser) {
      throw new BadRequestError("Đã xảy ra lỗi, vui lòng thử lại sau");
    }

    try {
      if (money < 0 && findUser.money + money < 0) {
        throw new BadRequestError("Số dư không đủ để trừ");
      }

      const updateMoney = await NguoiDung.findOneAndUpdate(
        {
          _id: userId,
          isProcessing: true,
        },
        {
          $inc: { money },
          $set: { isProcessing: false },
        },
        { new: true }
      );
      if (!updateMoney) {
        throw new BadRequestError("Đã xảy ra lỗi, vui lòng thử lại sau");
      }

      const tienTruoc = findUser.money;
      const tienSau = findUser.money + money;
      const defaultNote = money > 0 ? `Admin cộng tiền` : `Admin trừ tiền`;
      const content = note || defaultNote;

      // Chỉ cộng tiền → ghi lịch sử nạp (hoàn tất). Trừ tiền không ghi lịch sử rút.
      if (money > 0) {
        await LichSuNap.create({
          nguoiDung: userId,
          soTien: money,
          tinhTrang: STATUS_DEPOSIT.SUCCESS,
          noiDung: content,
          nganHang: {
            shortName: "ADMIN",
            tenNganHang: "Admin cộng tiền",
            tenChuTaiKhoan: req.user.taiKhoan,
            soTaiKhoan: "ADMIN",
          },
        });
      }

      await BienDongSoDuServiceFactory.createBienDong({
        type: TYPE_BALANCE_FLUCTUATION.DEPOSIT,
        payload: {
          nguoiDung: userId,
          tienTruoc,
          tienSau,
          noiDung: content,
          loaiDeposit: money > 0 ? LOAI_DEPOSIT.NHAN_TIEN : LOAI_DEPOSIT.TRU_TIEN,
        },
      });

      await NhatKyHoatDong.insertNhatKyHoatDong({
        taiKhoan: req.user.taiKhoan,
        userId: req.user._id,
        typeActivity: TYPE_ACTIVITY.ADMIN,
        actionActivity: ACTION_ACTIVITY.ADMIN.UPDATE_MONEY,
        description: `${money > 0 ? "Cộng tiền" : "Trừ tiền"} người chơi: ${findUser.taiKhoan}: ${convertMoney(money)}`,
        metadata: {
          tienTruoc: convertMoney(tienTruoc),
          tienSau: convertMoney(tienSau),
          nguoiDung: userId,
          taiKhoan: findUser.taiKhoan,
          noiDung: content,
        },
      });

      UserSocketService.updateUserBalance({
        user: findUser.taiKhoan,
        updateBalance: money,
      });
    } catch (err) {
      await NguoiDung.findOneAndUpdate({ _id: userId }, { isProcessing: false });
      throw err;
    }

    return new OkResponse({
      message: money > 0 ? "Cộng tiền thành công" : "Trừ tiền thành công",
      metadata: {
        userId,
        moneyUpdate: money,
      },
    }).send(res);
  });
  static updatePasswordUser = catchAsync(async (req, res, next) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (newPassword.trim().length < MIN_LENGTH_PASSWORD) {
      throw new UnauthorizedError(`Mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`);
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    const updateUser = await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        matKhau: hashPassword,
      },
      { new: false }
    );
    if (!updateUser) {
      throw new BadRequestError("Không tìm thấy tài khoản");
    }

    // Xóa refresh token để logout
    await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        refreshToken: [],
      }
    );

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.UPDATE_PASSWORD_USER,
      description: `Cập nhật mật khẩu người chơi: ${updateUser.taiKhoan}`,
    });

    global._io.to(`${updateUser.taiKhoan}`).emit("sign-out");

    return new OkResponse({
      message: "Update mật khẩu thành công",
      metadata: {
        userId,
        newPassword,
      },
    }).send(res);
  });
  static updateInformationUser = catchAsync(async (req, res, next) => {
    const { userId, role, status = false } = req.body;
    if (!userId || !role) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (!Object.values(USER_ROLE).includes(role)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const findUser = await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        status,
        role,
      },
      { new: false }
    );
    if (!findUser) {
      throw new BadRequestError("Không tìm thấy tài khoản");
    }
    if (findUser.status !== status || findUser.role !== role) {
      // Xóa refresh token để logout
      await NguoiDung.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          refreshToken: [],
        }
      );
      global._io.to(`${findUser.taiKhoan}`).emit("sign-out");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.UPDATE_INFORMATION_USER,
      description: `Cập nhật thông tin người chơi: ${findUser.taiKhoan}`,
      metadata: {
        roleBefore: findUser.role,
        roleAfter: role,
        statusBefore: findUser.status,
        statusAfter: status,
      },
    });

    return new OkResponse({
      message: "Update thông tin thành công",
      metadata: {
        userId,
        role,
        status,
      },
    }).send(res);
  });
  static countAllUser = catchAsync(async (req, res, next) => {
    const searchQuery = req.query?.query ?? "";
    let query = {
      role: { $ne: USER_ROLE.ADMIN },
    };
    if (searchQuery) {
      query.taiKhoan = new RegExp(searchQuery, "i");
    }
    const countList = await NguoiDung.countDocuments(query);
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  static countAllLichSuNap = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const countList = await LichSuNap.countDocuments({
      nguoiDung: userId,
    });
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  static getLichSuNapUser = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await LichSuNap.find({ nguoiDung: userId }).select("-__v").skip(skip).limit(results).sort(sortValue).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
      },
    }).send(res);
  });

  static countAllBienDongSoDu = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const countList = await BienDongSoDu.countDocuments({
      nguoiDung: userId,
    });
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  static getBienDongSoDuUser = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await BienDongSoDu.find({ nguoiDung: userId }).select("-__v").skip(skip).limit(results).sort(sortValue).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
      },
    }).send(res);
  });
  static getNhatKyHoatDongUser = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = page - 1;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const limit = Math.ceil(results / 10);
    const list = await NhatKyHoatDong.find({ nguoiDungId: userId }).select("-__v").skip(skip).limit(limit).sort(sortValue).lean();
    const transformData = list.flatMap((data) => data.history).sort((a, b) => b.createdAt - a.createdAt);

    return new OkResponse({
      data: transformData,
      metadata: {
        results: transformData.length,
        page,
        limitItems: results,
        sort: sortValue,
      },
    }).send(res);
  });

  static countAllNhatKyHoatDong = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const list = await NhatKyHoatDong.find({ nguoiDungId: userId }).lean();
    const countList = list.flatMap((data) => data.history)?.length ?? 0;
    return new OkResponse({
      data: countList,
    }).send(res);
  });

  static getDanhSachUsers = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    const searchQuery = req.query?.query ?? "";
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    let query = {
      role: { $ne: USER_ROLE.ADMIN },
    };
    if (searchQuery) {
      query.taiKhoan = new RegExp(searchQuery, "i");
    }

    const list = await NguoiDung.find(query)
      .select("-__v -matKhau -refreshToken -refreshTokenUsed")
      .skip(skip)
      .limit(results)
      .sort(sortValue)
      .lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        searchQuery,
      },
    }).send(res);
  });

  /** Danh sách tài khoản role=admin (menu Cài đặt → Danh sách quản trị) */
  static getDanhSachAdmins = catchAsync(async (req, res, next) => {
    const searchQuery = req.query?.query ?? "";
    let query = { role: USER_ROLE.ADMIN };
    if (searchQuery) {
      query.taiKhoan = new RegExp(searchQuery, "i");
    }
    const list = await NguoiDung.find(query)
      .select("-__v -matKhau -refreshToken -refreshTokenUsed")
      .sort("-createdAt")
      .lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        searchQuery,
      },
    }).send(res);
  });
}

module.exports = UserAdminController;
