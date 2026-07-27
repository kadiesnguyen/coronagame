const { default: mongoose } = require("mongoose");
const { MIN_MONEY_WITHDRAW, STATUS_WITHDRAW } = require("../../configs/withdraw.config");
const LichSuRut = require("../../models/LichSuRut");
const LienKetNganHang = require("../../models/LienKetNganHang");
const { UnauthorizedError, BadRequestError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { convertMoney } = require("../../utils/convertMoney");
const { OkResponse, CreatedResponse } = require("../../utils/successResponse");
const _ = require("lodash");
const BienDongSoDuServiceFactory = require("../../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../../configs/balance.fluctuation.config");
const UserSocketService = require("../../services/user.socket.service");
const TelegramService = require("../../services/telegram.service");
const { TYPE_SEND_MESSAGE } = require("../../configs/telegram.config");
const { LOAI_DEPOSIT } = require("../../configs/deposit.config");
const NguoiDung = require("../../models/NguoiDung");
class RutTienAdminController {
  static getChiTietLichSuRut = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await LichSuRut.findOne({ _id: id })
      .select("-__v")
      .populate({
        path: "nguoiDung",
        select: "taiKhoan",
      })
      .populate("nganHang")
      .lean();
    if (!data) {
      throw new BadRequestError("Lịch sử rút không tồn tại");
    }
    return new OkResponse({
      data: data,
    }).send(res);
  });
  static updateChiTietLichSuRut = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { tinhTrang, noiDung } = req.body;
    const data = await LichSuRut.findOne({ _id: id })
      .select("-__v")
      .populate({
        path: "nguoiDung",
      })
      .populate("nganHang")
      .lean();
    if (!data) {
      throw new BadRequestError("Lịch sử rút không tồn tại");
    }
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const updateLichSuRut = await LichSuRut.findOneAndUpdate(
          { _id: id },
          { tinhTrang, noiDung },
          {
            session,
            new: false,
          }
        );
        // Hủy đơn hàng thì cộng tiền lại cho người dùng
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
          // Cong tien User
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
          // Update số dư tài khoản realtime
          UserSocketService.updateUserBalance({ user: data.nguoiDung.taiKhoan, updateBalance: data.soTien });
          const thongTinNganHang = `${data.nganHang.tenNganHang} - ${data.nganHang.tenChuTaiKhoan} - ${data.nganHang.soTaiKhoan}`;
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
    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });
  static countAllLichSuRut = catchAsync(async (req, res, next) => {
    const userId = req.query.userId || "";
    let query = {};
    if (userId) {
      query = {
        nguoiDung: userId,
      };
    }
    const countList = await LichSuRut.countDocuments(query);
    return new OkResponse({
      data: countList,
      metadata: {
        userId,
      },
    }).send(res);
  });
  static getDanhSachLichSuRut = catchAsync(async (req, res, next) => {
    const userId = req.query.userId || "";
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    let query = {};
    if (userId) {
      query = {
        nguoiDung: userId,
      };
    }
    const list = await LichSuRut.find(query)
      .select("-__v")
      .skip(skip)
      .limit(results)
      .sort(sortValue)
      .lean()
      .populate({
        path: "nguoiDung",
        select: "taiKhoan",
      })
      .populate("nganHang");
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        userId,
      },
    }).send(res);
  });
}
module.exports = RutTienAdminController;
