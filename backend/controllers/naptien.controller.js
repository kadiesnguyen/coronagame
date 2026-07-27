const { default: mongoose } = require("mongoose");
const { MIN_MONEY_WITHDRAW } = require("../configs/withdraw.config");
const LichSuNap = require("../models/LichSuNap");
const LienKetNganHang = require("../models/LienKetNganHang");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { convertMoney } = require("../utils/convertMoney");
const { OkResponse, CreatedResponse } = require("../utils/successResponse");
const _ = require("lodash");
const BienDongSoDuServiceFactory = require("../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const UserSocketService = require("../services/user.socket.service");
const TelegramService = require("../services/telegram.service");
const { TYPE_SEND_MESSAGE } = require("../configs/telegram.config");
const NguoiDung = require("../models/NguoiDung");
const { MIN_MONEY_DEPOSIT, LOAI_DEPOSIT } = require("../configs/deposit.config");
const HeThong = require("../models/HeThong");
class NapTienController {
  static getDanhSach = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const { _id: userId } = req.user;
    const list = await LichSuNap.find({ nguoiDung: userId }).skip(skip).limit(results).sort(sortValue).lean();
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
  static createNapTien = catchAsync(async (req, res, next) => {
    const { _id: userId, money, taiKhoan } = req.user;
    const { soTien, nganHang } = req.body;
    if (!soTien || !nganHang) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }

    if (!_.isNumber(soTien)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (soTien < MIN_MONEY_DEPOSIT) {
      throw new UnauthorizedError("Số tiền nạp tối thiểu phải là " + convertMoney(MIN_MONEY_DEPOSIT));
    }
    const { _id: nganHangId, shortName, soTaiKhoan, tenBank, tenChuTaiKhoan } = nganHang;
    const findThongTinNganHang = await HeThong.findOne({
      systemID: 1,
      danhSachNganHang: {
        $elemMatch: {
          shortName,
          status: true,
        },
      },
    });
    if (!findThongTinNganHang) {
      throw new UnauthorizedError("Không tìm thấy thông tin ngân hàng");
    }
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      try {
        const insertLichSuNap = await LichSuNap.create(
          [
            {
              nguoiDung: userId,
              nganHang,
              soTien,
            },
          ],
          {
            session,
          }
        );
        const thongTinNganHang = `${tenBank} - ${shortName} - ${tenChuTaiKhoan} - ${soTaiKhoan}`;
        await BienDongSoDuServiceFactory.createBienDong({
          type: TYPE_BALANCE_FLUCTUATION.DEPOSIT,
          payload: {
            nguoiDung: userId,
            tienTruoc: money,
            tienSau: money,
            noiDung: `Gửi yêu cầu nạp tiền đến ${thongTinNganHang} với số tiền ${convertMoney(soTien)}`,
            loaiDeposit: LOAI_DEPOSIT.NAP_TIEN,
          },
          options: {
            session,
          },
        });

        // Send notification Telegram
        const noiDungBot = `${taiKhoan} vừa gửi yêu cầu nạp tiền đến ${thongTinNganHang} với số tiền ${convertMoney(soTien)}`;
        TelegramService.sendNotification({ content: noiDungBot, type: TYPE_SEND_MESSAGE.DEPOSIT });
        await session.commitTransaction();
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        throw err;
      } finally {
        await session.endSession();
      }
    });

    return new CreatedResponse({
      message: "Gửi yêu cầu nạp tiền thành công",
    }).send(res);
  });
}
module.exports = NapTienController;
