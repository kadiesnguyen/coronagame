"use strict";

const HeThong = require("../models/HeThong");
const NguoiDung = require("../models/NguoiDung");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");
const { DEFAULT_VIP_LEVELS, normalizeVipLevels, resolveVipLevel } = require("../utils/vip");

exports.getVipLevels = catchAsync(async (req, res) => {
  const heThong = await HeThong.findOne({ systemID: 1 }).select("vipLevels");
  const vipLevels = normalizeVipLevels(heThong?.vipLevels ?? DEFAULT_VIP_LEVELS);
  const user = await NguoiDung.findById(req.user._id).select("money");
  const currentLevel = resolveVipLevel(user?.money, vipLevels);

  return new OkResponse({
    data: {
      vipLevels,
      currentLevel,
      money: user?.money ?? 0,
    },
  }).send(res);
});
