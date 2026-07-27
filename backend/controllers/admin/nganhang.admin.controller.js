"use strict";

const catchAsync = require("../../utils/catch_async");
const _ = require("lodash");
const { OkResponse, CreatedResponse } = require("../../utils/successResponse");

const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");
const HeThong = require("../../models/HeThong");
const listBank = require("../../configs/listBank");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");

class NganHangAdminController {
  static getDanhSachNganHang = catchAsync(async (req, res, next) => {
    let results = await HeThong.findOne({
      systemID: 1,
    }).select("danhSachNganHang");
    return new OkResponse({
      data: results?.danhSachNganHang ?? [],
    }).send(res);
  });

  static createNganHang = catchAsync(async (req, res, next) => {
    const { soTaiKhoan, tenChuTaiKhoan, code } = req.body;
    if (!code || !soTaiKhoan || !tenChuTaiKhoan) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const findBankByCode = listBank.find((item) => item.code === code);
    if (!findBankByCode) {
      throw new BadRequestError("Mã code ngân hàng không hợp lệ");
    }
    const { logo: image, shortName, name: tenBank } = findBankByCode;

    const findNganHang = await HeThong.findOne({
      systemID: 1,
      danhSachNganHang: {
        $elemMatch: {
          code: code,
        },
      },
    });
    if (findNganHang) {
      throw new BadRequestError("Đã tồn tại ngân hàng này");
    }
    await HeThong.updateOne(
      {
        systemID: 1,
      },
      {
        $push: {
          danhSachNganHang: {
            shortName,
            tenBank,
            image,
            code,
            soTaiKhoan,
            tenChuTaiKhoan,
          },
        },
      }
    );

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.ADD_BANK,
      description: `Thêm ngân hàng nạp tiền mới`,
      metadata: {
        shortName,
        tenBank,
        image,
        code,
        soTaiKhoan,
        tenChuTaiKhoan,
      },
    });

    return new CreatedResponse({
      message: "Tạo thành công",
    }).send(res);
  });
  static getChiTietNganHang = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let result = await HeThong.findOne(
      {
        systemID: 1,
        danhSachNganHang: {
          $elemMatch: {
            _id: id,
          },
        },
      },
      {
        "danhSachNganHang.$": 1,
      }
    );
    if (!result) {
      throw new BadRequestError("Không tìm thấy ngân hàng");
    }
    return new OkResponse({
      data: result?.danhSachNganHang?.[0],
    }).send(res);
  });

  static editNganHang = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { soTaiKhoan, tenChuTaiKhoan, code, status } = req.body;
    const findBankByCode = listBank.find((item) => item.code === code);
    if (!findBankByCode) {
      throw new BadRequestError("Mã code ngân hàng không hợp lệ");
    }
    const { logo: image, shortName, name: tenBank } = findBankByCode;

    const result = await HeThong.findOneAndUpdate(
      { systemID: 1, "danhSachNganHang._id": id },
      {
        $set: {
          "danhSachNganHang.$.code": code,
          "danhSachNganHang.$.shortName": shortName,
          "danhSachNganHang.$.tenBank": tenBank,
          "danhSachNganHang.$.image": image,
          "danhSachNganHang.$.soTaiKhoan": soTaiKhoan,
          "danhSachNganHang.$.tenChuTaiKhoan": tenChuTaiKhoan,
          "danhSachNganHang.$.status": !!status,
        },
      },
      {
        new: false,
        projection: {
          "danhSachNganHang.$": 1,
        },
      }
    );

    if (!result) {
      throw new BadRequestError("Không tìm thấy ngân hàng");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.EDIT_BANK,
      description: `Chỉnh sửa ngân hàng nạp tiền`,
      metadata: {
        before: result,
        after: { soTaiKhoan, tenChuTaiKhoan, code, status, image, shortName, tenBank },
      },
    });

    return new OkResponse({
      message: "Edit thành công",
    }).send(res);
  });

  static deleteNganHang = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await HeThong.findOneAndUpdate(
      {
        systemID: 1,
        "danhSachNganHang._id": id,
      },
      {
        $pull: {
          danhSachNganHang: {
            _id: id,
          },
        },
      },
      {
        new: false,
        projection: {
          "danhSachNganHang.$": 1,
        },
      }
    );
    if (!result) {
      throw new BadRequestError("Không tìm thấy ngân hàng");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.REMOVE_BANK,
      description: `Xóa ngân hàng nạp tiền`,
      metadata: {
        id,
      },
    });
    return new OkResponse({
      message: "Xóa thành công",
    }).send(res);
  });
}

module.exports = NganHangAdminController;
