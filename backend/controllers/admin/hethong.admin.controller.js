"use strict";
const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");

const catchAsync = require("../../utils/catch_async");
const { OkResponse } = require("../../utils/successResponse");
const _ = require("lodash");
const HeThong = require("../../models/HeThong");
const TelegramService = require("../../services/telegram.service");
const { default: axios } = require("axios");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");

class HeThongAdminController {
  static getBotTelegramConfig = catchAsync(async (req, res, next) => {
    const heThong = await HeThong.findOne({ systemID: 1 });
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }
    return new OkResponse({
      data: heThong?.telegramBotConfigs ?? null,
    }).send(res);
  });
  static getTawkToConfig = catchAsync(async (req, res, next) => {
    const heThong = await HeThong.findOne({ systemID: 1 });
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }
    return new OkResponse({
      data: heThong?.cskhConfigs?.tawk ?? null,
    }).send(res);
  });
  static updateBotTelegramConfig = catchAsync(async (req, res, next) => {
    const { telegramBotConfigs } = req.body;
    if (!telegramBotConfigs || !_.isPlainObject(telegramBotConfigs)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const heThong = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "telegramBotConfigs.idReceiveMessage": telegramBotConfigs?.idReceiveMessage ?? "",
          "telegramBotConfigs.botToken": telegramBotConfigs?.botToken ?? "",
          "telegramBotConfigs.isGameNotify": telegramBotConfigs?.isGameNotify ?? false,
          "telegramBotConfigs.isDepositNotify": telegramBotConfigs?.isDepositNotify ?? false,
        },
      },
      {
        new: false,
      }
    );
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }
    if (global._botTelegram) {
      await global._botTelegram.close();
    }
    await TelegramService.initBot();
    TelegramService.sendNotification({ content: "Test Bot Message" });
    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_BOT_TELEGRAM,
      description: `Set cấu hình bot telegram`,
      metadata: {
        before: heThong.telegramBotConfigs,
        after: telegramBotConfigs,
      },
    });

    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });
  static updateTawkToConfig = catchAsync(async (req, res, next) => {
    const { tawkToConfigs } = req.body;
    if (!tawkToConfigs || !_.isPlainObject(tawkToConfigs)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const { propertyId, widgetId } = tawkToConfigs;
    try {
      // Check config is valid
      const testConfig = await axios.get(`https://tawk.to/chat/${propertyId}/${widgetId}`, {});
    } catch (err) {
      throw new BadRequestError("Thông tin cấu hình không hợp lệ");
    }
    const heThong = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "cskhConfigs.tawk.propertyId": propertyId ?? "",
          "cskhConfigs.tawk.widgetId": widgetId ?? "",
        },
      },
      {
        new: false,
      }
    );
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_TAWK_TO,
      description: `Set cấu hình tawk to`,
      metadata: {
        before: heThong.cskhConfigs.tawk,
        after: tawkToConfigs,
      },
    });
    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });
}

module.exports = HeThongAdminController;
