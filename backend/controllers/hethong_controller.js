const HeThong = require("../models/HeThong");
const { BadRequestError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");

exports.getNganHang = catchAsync(async (req, res, next) => {
  const data = await HeThong.findOne({
    systemID: 1,
    danhSachNganHang: {
      $elemMatch: {
        status: true,
      },
    },
  }).select("danhSachNganHang");
  return new OkResponse({
    message: "Lấy danh sách ngân hàng thành công",
    data: data?.danhSachNganHang?.filter((item) => item.status) ?? [],
  }).send(res);
});
exports.getConfigTawk = catchAsync(async (req, res, next) => {
  const results = await HeThong.findOne({
    systemID: 1,
  }).select("cskhConfigs.tawk");
  return new OkResponse({
    data: results?.cskhConfigs?.tawk ?? {},
  }).send(res);
});
