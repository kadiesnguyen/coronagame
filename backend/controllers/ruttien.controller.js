const { default: mongoose } = require("mongoose");
const { MIN_MONEY_WITHDRAW } = require("../configs/withdraw.config");
const LichSuRut = require("../models/LichSuRut");
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
const AdminSocketService = require("../services/admin.socket.service");
const { normalizeWithdrawBankList } = require("../utils/withdraw_bank");

class RutTienController {
  static getDanhSach = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const { _id: userId } = req.user;
    let list = await LichSuRut.find({ nguoiDung: userId }).skip(skip).limit(results).sort(sortValue).lean();
    list = await normalizeWithdrawBankList(list);
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

  static createRutTien = catchAsync(async (req, res, next) => {
    const { _id: userId, money, taiKhoan } = req.user;
    const { soTien, tenNganHang, tenChuTaiKhoan, soTaiKhoan, bankCode } = req.body;
    if (!soTien || !tenNganHang?.trim() || !tenChuTaiKhoan?.trim() || !soTaiKhoan?.trim()) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (!_.isNumber(soTien)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (soTien < MIN_MONEY_WITHDRAW) {
      throw new UnauthorizedError("Số tiền rút tối thiểu phải là " + convertMoney(MIN_MONEY_WITHDRAW));
    }

    const nganHangSnapshot = {
      tenNganHang: String(tenNganHang).trim(),
      tenChuTaiKhoan: String(tenChuTaiKhoan).trim(),
      soTaiKhoan: String(soTaiKhoan).trim(),
      bankCode: String(bankCode || "").trim(),
    };

    let retries = 3;
    while (retries > 0) {
      let isErrorUpdateMoneyConcurrency = false;
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const checkUserMoney = await NguoiDung.findOneAndUpdate(
            {
              taiKhoan,
              isProcessing: false,
              money: { $gte: soTien },
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
          if (!checkUserMoney) {
            isErrorUpdateMoneyConcurrency = true;
            throw new BadRequestError("Có lỗi xảy ra, vui lòng thử lại sau");
          }

          const insertLichSuRut = await LichSuRut.create(
            [
              {
                nguoiDung: userId,
                nganHang: nganHangSnapshot,
                soTien,
              },
            ],
            {
              session,
            }
          );
          const updateUserMoney = await NguoiDung.findOneAndUpdate(
            {
              taiKhoan,
              isProcessing: true,
              money: { $gte: soTien },
            },
            { $inc: { money: -soTien }, $set: { isProcessing: false } },
            {
              new: true,
              session,
            }
          );
          if (!updateUserMoney) {
            isErrorUpdateMoneyConcurrency = true;
            throw new BadRequestError("Có lỗi xảy ra, vui lòng thử lại sau");
          }
          const thongTinNganHang = `${nganHangSnapshot.tenNganHang} - ${nganHangSnapshot.tenChuTaiKhoan} - ${nganHangSnapshot.soTaiKhoan}`;
          await BienDongSoDuServiceFactory.createBienDong({
            type: TYPE_BALANCE_FLUCTUATION.WITHDRAW,
            payload: {
              nguoiDung: userId,
              tienTruoc: money,
              tienSau: money - soTien,
              noiDung: `Gửi yêu cầu rút tiền về ${thongTinNganHang} với số tiền ${convertMoney(soTien)}`,
              nganHang: thongTinNganHang,
            },
            options: {
              session,
            },
          });
          UserSocketService.updateUserBalance({ user: taiKhoan, updateBalance: -soTien });
          const noiDungBot = `${taiKhoan} vừa gửi yêu cầu rút tiền về ${thongTinNganHang} với số tiền ${convertMoney(soTien)}`;
          TelegramService.sendNotification({ content: noiDungBot, type: TYPE_SEND_MESSAGE.WITHDRAW });
          const created = insertLichSuRut[0];
          AdminSocketService.notifyNewRequest({
            id: String(created._id),
            type: "withdraw",
            taiKhoan,
            soTien,
            href: "/admin/withdraw",
            title: "Yêu cầu rút tiền",
            message: `${taiKhoan} gửi yêu cầu rút ${convertMoney(soTien)}`,
            createdAt: created.createdAt || new Date().toISOString(),
          });
        });
        break;
      } catch (error) {
        if (isErrorUpdateMoneyConcurrency) {
          retries -= 1;
          if (retries === 0) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 100 * (3 - retries)));
        } else {
          throw error;
        }
      } finally {
        await NguoiDung.findOneAndUpdate(
          {
            taiKhoan,
          },
          {
            $set: {
              isProcessing: false,
            },
          },
          {
            session,
          }
        );
        await session.endSession();
      }
    }

    return new CreatedResponse({
      message: "Gửi yêu cầu rút tiền thành công",
    }).send(res);
  });
}
module.exports = RutTienController;
