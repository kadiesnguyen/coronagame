const { default: mongoose } = require("mongoose");
const { STATUS_WITHDRAW } = require("../../configs/withdraw.config");
const LichSuRut = require("../../models/LichSuRut");
const { BadRequestError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { convertMoney } = require("../../utils/convertMoney");
const { OkResponse } = require("../../utils/successResponse");
const BienDongSoDuServiceFactory = require("../../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../../configs/balance.fluctuation.config");
const UserSocketService = require("../../services/user.socket.service");
const { LOAI_DEPOSIT } = require("../../configs/deposit.config");
const NguoiDung = require("../../models/NguoiDung");
const { normalizeWithdrawBank, normalizeWithdrawBankList } = require("../../utils/withdraw_bank");

class RutTienAdminController {
  static getChiTietLichSuRut = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let data = await LichSuRut.findOne({ _id: id })
      .select("-__v")
      .populate({
        path: "nguoiDung",
        select: "taiKhoan",
      })
      .lean();
    if (!data) {
      throw new BadRequestError("Lịch sử rút không tồn tại");
    }
    data = await normalizeWithdrawBank(data);
    return new OkResponse({
      data: data,
    }).send(res);
  });

  static updateNganHangLichSuRut = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { tenNganHang, tenChuTaiKhoan, soTaiKhoan, bankCode } = req.body;
    const data = await LichSuRut.findOne({ _id: id }).select("_id tinhTrang").lean();
    if (!data) {
      throw new BadRequestError("Lịch sử rút không tồn tại");
    }
    if (data.tinhTrang !== STATUS_WITHDRAW.PENDING) {
      throw new BadRequestError("Chỉ được đổi ngân hàng khi lệnh đang chờ duyệt");
    }
    if (!tenNganHang?.trim() || !tenChuTaiKhoan?.trim() || !soTaiKhoan?.trim()) {
      throw new BadRequestError("Vui lòng nhập đầy đủ thông tin ngân hàng");
    }
    const nganHang = {
      tenNganHang: tenNganHang.trim(),
      tenChuTaiKhoan: tenChuTaiKhoan.trim(),
      soTaiKhoan: soTaiKhoan.trim(),
      bankCode: String(bankCode || "").trim(),
    };
    const updated = await LichSuRut.findOneAndUpdate(
      { _id: id, tinhTrang: STATUS_WITHDRAW.PENDING },
      { nganHang },
      { new: true }
    ).lean();
    if (!updated) {
      throw new BadRequestError("Không thể cập nhật ngân hàng trên lệnh này");
    }
    return new OkResponse({
      data: updated.nganHang,
      message: "Cập nhật tài khoản ngân hàng trên lệnh thành công",
    }).send(res);
  });

  static updateChiTietLichSuRut = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { tinhTrang, noiDung } = req.body;
    let data = await LichSuRut.findOne({ _id: id })
      .select("-__v")
      .populate({
        path: "nguoiDung",
      })
      .lean();
    if (!data) {
      throw new BadRequestError("Lịch sử rút không tồn tại");
    }
    data = await normalizeWithdrawBank(data);
    if (data.tinhTrang !== STATUS_WITHDRAW.PENDING) {
      throw new BadRequestError("Đơn đã xử lý, không thể đổi trạng thái");
    }
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const updateLichSuRut = await LichSuRut.findOneAndUpdate(
          { _id: id, tinhTrang: STATUS_WITHDRAW.PENDING },
          { tinhTrang, noiDung },
          {
            session,
            new: false,
          }
        );
        if (!updateLichSuRut) {
          throw new BadRequestError("Đơn đã xử lý, không thể đổi trạng thái");
        }
        if (updateLichSuRut.tinhTrang === STATUS_WITHDRAW.PENDING && tinhTrang === STATUS_WITHDRAW.CANCEL) {
          const checkUser = await NguoiDung.findOneAndUpdate(
            {
              taiKhoan: data.nguoiDung.taiKhoan,
              isProcessing: false,
            },
            {
              $set: {
                isProcessing: true,
                lockTimestamp: Date.now(),
              },
            },
            {
              new: true,
              session,
            }
          );
          if (!checkUser) {
            throw new BadRequestError("Có lỗi xảy ra, vui lòng thử lại sau");
          }
          const updateUserMoney = await NguoiDung.findOneAndUpdate(
            {
              taiKhoan: data.nguoiDung.taiKhoan,
              isProcessing: true,
            },
            { $inc: { money: data.soTien }, $set: { isProcessing: false } },
            {
              new: true,
              session,
            }
          );
          if (!updateUserMoney) {
            throw new BadRequestError("Có lỗi xảy ra, vui lòng thử lại sau");
          }
          UserSocketService.updateUserBalance({ user: data.nguoiDung.taiKhoan, updateBalance: data.soTien });
          const thongTinNganHang = `${data.nganHang?.tenNganHang || ""} - ${data.nganHang?.tenChuTaiKhoan || ""} - ${
            data.nganHang?.soTaiKhoan || ""
          }`;
          await BienDongSoDuServiceFactory.createBienDong({
            type: TYPE_BALANCE_FLUCTUATION.DEPOSIT,
            payload: {
              nguoiDung: updateUserMoney._id,
              tienTruoc: checkUser.money,
              tienSau: checkUser.money + data.soTien,
              noiDung: `Hoàn lại tiền do đơn rút tiền tiền về ${thongTinNganHang} với số tiền ${convertMoney(data.soTien)} bị hủy. `,
              loaiDeposit: LOAI_DEPOSIT.NHAN_TIEN,
            },
            options: {
              session,
            },
          });
        }
        await session.commitTransaction();
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
    const isSuccess = tinhTrang === STATUS_WITHDRAW.SUCCESS;
    const isCancel = tinhTrang === STATUS_WITHDRAW.CANCEL;
    if (isSuccess || isCancel) {
      UserSocketService.notifyUser({
        taiKhoan: data.nguoiDung.taiKhoan,
        payload: {
          id: `withdraw:${id}:${tinhTrang}`,
          type: "withdraw",
          status: tinhTrang,
          href: "/withdraw-history",
          title: isSuccess ? "Rút tiền thành công" : "Rút tiền bị hủy",
          message: isSuccess
            ? `Đơn rút ${convertMoney(data.soTien)} đã được duyệt chuyển khoản.`
            : `Đơn rút ${convertMoney(data.soTien)} đã bị hủy, tiền đã hoàn lại.${noiDung ? ` ${noiDung}` : ""}`,
          soTien: data.soTien,
        },
      });
    }

    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });

  static buildListQuery = (req) => {
    const userId = req.query.userId || "";
    const statusGroup = req.query.statusGroup || "";
    const tinhTrang = req.query.tinhTrang || "";
    const query = {};
    if (userId) query.nguoiDung = userId;
    if (tinhTrang) {
      query.tinhTrang = tinhTrang;
    } else if (statusGroup === "pending") {
      query.tinhTrang = STATUS_WITHDRAW.PENDING;
    } else if (statusGroup === "history") {
      query.tinhTrang = { $in: [STATUS_WITHDRAW.SUCCESS, STATUS_WITHDRAW.CANCEL] };
    }
    return query;
  };

  static countAllLichSuRut = catchAsync(async (req, res, next) => {
    const query = RutTienAdminController.buildListQuery(req);
    const countList = await LichSuRut.countDocuments(query);
    return new OkResponse({
      data: countList,
      metadata: {
        userId: req.query.userId || "",
        statusGroup: req.query.statusGroup || "",
      },
    }).send(res);
  });

  static getDanhSachLichSuRut = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const query = RutTienAdminController.buildListQuery(req);
    let list = await LichSuRut.find(query)
      .select("-__v")
      .skip(skip)
      .limit(results)
      .sort(sortValue)
      .lean()
      .populate({
        path: "nguoiDung",
        select: "taiKhoan",
      });
    list = await normalizeWithdrawBankList(list);
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        userId: req.query.userId || "",
        statusGroup: req.query.statusGroup || "",
      },
    }).send(res);
  });
}
module.exports = RutTienAdminController;
