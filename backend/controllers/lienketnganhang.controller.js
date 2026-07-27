const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../configs/activity.config");
const LienKetNganHang = require("../models/LienKetNganHang");
const NhatKyHoatDong = require("../models/NhatKyHoatDong");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/successResponse");

class LienKetNganHangController {
  static getDanhSach = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const list = await LienKetNganHang.find({ nguoiDung: userId }).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
      },
    }).send(res);
  });
  static createNganHang = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { tenNganHang, bankCode, tenChuTaiKhoan, soTaiKhoan } = req.body;
    if (!tenNganHang || !bankCode || !tenChuTaiKhoan || !soTaiKhoan) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin muốn thêm ngân hàng liên kết");
    }
    const insertNganHang = await LienKetNganHang.findOneAndUpdate(
      { nguoiDung: userId, tenNganHang, tenChuTaiKhoan, soTaiKhoan },
      { nguoiDung: userId, tenNganHang, bankCode, tenChuTaiKhoan, soTaiKhoan },
      {
        new: false,
        upsert: true,
      }
    );
    if (insertNganHang) {
      throw new BadRequestError("Ngân hàng này đã được thêm vào tài khoản của bạn");
    }
    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.BANK,
      actionActivity: ACTION_ACTIVITY.BANK.CREATE_BANK,
      description: `Thêm liên kết ngân hàng`,
      metadata: {
        tenNganHang,
        bankCode,
        tenChuTaiKhoan,
        soTaiKhoan,
      },
    });

    return new CreatedResponse({
      message: "Thêm thành công",
    }).send(res);
  });
}
module.exports = LienKetNganHangController;
