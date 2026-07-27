"use strict";

const catchAsync = require("../../utils/catch_async");
const _ = require("lodash");
const { OkResponse, CreatedResponse } = require("../../utils/successResponse");

const ThongBao = require("../../models/ThongBao");
const { BadRequestError } = require("../../utils/app_error");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const { deleteLocalUpload } = require("../../configs/upload.local.config");

const NOTIF_UPLOAD_FOLDER = "notifications";

class ThongBaoAdminController {
  static uploadHinhAnh = catchAsync(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError("Vui lòng chọn file ảnh");
    }
    const url = `/uploads/${NOTIF_UPLOAD_FOLDER}/${req.file.filename}`;
    return new OkResponse({
      message: "Upload thành công",
      data: { url },
    }).send(res);
  });

  static deleteHinhAnhFile = catchAsync(async (req, res) => {
    const { url } = req.body;
    if (!url || !String(url).startsWith(`/uploads/${NOTIF_UPLOAD_FOLDER}/`)) {
      throw new BadRequestError("Đường dẫn ảnh không hợp lệ");
    }
    deleteLocalUpload(url, NOTIF_UPLOAD_FOLDER);
    return new OkResponse({
      message: "Đã xóa ảnh trên server",
    }).send(res);
  });

  static getChiTietThongBao = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await ThongBao.findOne({ _id: id }).select("-__v").lean();
    if (!data) {
      throw new BadRequestError("Thông báo không tồn tại");
    }

    return new OkResponse({
      data: data,
    }).send(res);
  });
  static createThongBao = catchAsync(async (req, res, next) => {
    const { tieuDe, hinhAnh, noiDung } = req.body;
    const data = await ThongBao.create({
      tieuDe,
      hinhAnh,
      noiDung,
    });

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.ADD_NOTIFICATION,
      description: `Thêm thông báo mới: ${tieuDe}`,
      metadata: {
        tieuDe,
        hinhAnh,
        noiDung,
      },
    });

    return new CreatedResponse({
      data: data,
      message: "Tạo thông báo thành công",
    }).send(res);
  });
  static editThongBao = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { tieuDe, hinhAnh, noiDung } = req.body;
    const result = await ThongBao.findOneAndUpdate(
      { _id: id },
      {
        tieuDe,
        hinhAnh,
        noiDung,
      },
      {
        new: false,
      }
    );
    if (!result) {
      throw new BadRequestError("Thông báo không tồn tại");
    }

    if (result.hinhAnh && result.hinhAnh !== hinhAnh) {
      deleteLocalUpload(result.hinhAnh, NOTIF_UPLOAD_FOLDER);
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.EDIT_NOTIFICATION,
      description: `Chỉnh sửa thông báo: ${result.tieuDe} -> ${tieuDe}`,
      metadata: {
        before: result,
        after: { tieuDe, hinhAnh, noiDung },
      },
    });

    return new OkResponse({
      message: "Chỉnh sửa thành công",
    }).send(res);
  });
  static deleteThongBao = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const checkIsExists = await ThongBao.findOneAndDelete({ _id: id });
    if (!checkIsExists) {
      throw new BadRequestError("Thông báo không tồn tại");
    }

    if (checkIsExists.hinhAnh) {
      deleteLocalUpload(checkIsExists.hinhAnh, NOTIF_UPLOAD_FOLDER);
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.DELETE_NOTIFICATION,
      description: `Xóa thông báo: ${checkIsExists.tieuDe}`,
      metadata: checkIsExists,
    });

    return new OkResponse({
      message: "Xóa thông báo thành công",
    }).send(res);
  });
  static countAllThongBao = catchAsync(async (req, res, next) => {
    const countList = await ThongBao.countDocuments({});
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  static getDanhSachThongBao = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await ThongBao.find({}).select("-__v").skip(skip).limit(results).sort(sortValue).lean();
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
}

module.exports = ThongBaoAdminController;
