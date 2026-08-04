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
  const tawk = results?.cskhConfigs?.tawk ?? {};
  const DEFAULT_SS =
    '<script src="https://plugin-code.salesmartly.com/js/project_787640_815005_1785157395.js" defer></script>';
  const stored =
    tawk.link ||
    (tawk.propertyId && tawk.widgetId ? `https://tawk.to/chat/${tawk.propertyId}/${tawk.widgetId}` : "") ||
    "";
  // Migrate empty / legacy ProvideSupport default → SaleSmartly widget
  const link =
    !stored || /providesupport\.com/i.test(stored) || /1pwnw71rbyasn0gk3p7lzo2mzy/i.test(stored)
      ? DEFAULT_SS
      : stored;
  return new OkResponse({
    data: { link },
  }).send(res);
});

exports.getBranding = catchAsync(async (req, res) => {
  const results = await HeThong.findOne({ systemID: 1 }).select("branding");
  const branding = results?.branding ?? {};
  return new OkResponse({
    data: {
      logoUrl: branding.logoUrl || "",
      banners: (branding.banners || []).filter((item) => item?.status !== false && item?.url),
    },
  }).send(res);
});
