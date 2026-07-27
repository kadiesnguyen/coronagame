"use strict";

const HeThong = require("../models/HeThong");
const NguoiDung = require("../models/NguoiDung");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");
const {
  DEFAULT_VIP_LEVELS,
  DEFAULT_KENO10P_TI_LE_VIP,
  normalizeVipLevels,
  normalizeTiLeVip,
  resolveVipLevel,
} = require("../utils/vip");

exports.getVipLevels = catchAsync(async (req, res) => {
  const heThong = await HeThong.findOne({ systemID: 1 }).select("vipLevels gameConfigs.kenoConfigs.keno10P");
  const vipLevels = normalizeVipLevels(heThong?.vipLevels ?? DEFAULT_VIP_LEVELS);
  const tiLeVip = normalizeTiLeVip(heThong?.gameConfigs?.kenoConfigs?.keno10P?.tiLeVip ?? DEFAULT_KENO10P_TI_LE_VIP);
  const user = await NguoiDung.findById(req.user._id).select("money");
  const currentLevel = resolveVipLevel(user?.money, vipLevels);

  return new OkResponse({
    data: {
      vipLevels,
      tiLeVip,
      currentLevel,
      money: user?.money ?? 0,
    },
  }).send(res);
});
