"use strict";
const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");

const catchAsync = require("../../utils/catch_async");
const { OkResponse } = require("../../utils/successResponse");
const _ = require("lodash");
const HeThong = require("../../models/HeThong");
const TelegramService = require("../../services/telegram.service");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const { DEFAULT_VIP_LEVELS, normalizeVipLevels } = require("../../utils/vip");
const { listUploadFolder } = require("../../configs/upload.local.config");

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
    const tawk = heThong?.cskhConfigs?.tawk ?? {};
    const DEFAULT_SS =
      '<script src="https://plugin-code.salesmartly.com/js/project_787640_815005_1785157395.js" defer></script>';
    const stored =
      tawk.link ||
      (tawk.propertyId && tawk.widgetId ? `https://tawk.to/chat/${tawk.propertyId}/${tawk.widgetId}` : "") ||
      "";
    const link =
      !stored || /providesupport\.com/i.test(stored) || /1pwnw71rbyasn0gk3p7lzo2mzy/i.test(stored)
        ? DEFAULT_SS
        : stored;
    return new OkResponse({
      data: { link },
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
    const link = String(tawkToConfigs.link || "").trim();
    if (!link) {
      throw new BadRequestError("Vui lòng nhập script CSKH (SaleSmartly / ProvideSupport)");
    }
    const isValidCskh =
      /salesmartly\.com/i.test(link) ||
      /providesupport\.com/i.test(link) ||
      /plugin-code\.salesmartly\.com/i.test(link) ||
      /<script/i.test(link) ||
      /^\(function/i.test(link) ||
      /^https?:\/\//i.test(link);
    if (!isValidCskh) {
      throw new BadRequestError("Dán script SaleSmartly hoặc ProvideSupport (hoặc URL https://...)");
    }
    const heThong = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "cskhConfigs.tawk.link": link,
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
      description: `Set cấu hình script CSKH`,
      metadata: {
        before: heThong.cskhConfigs.tawk,
        after: { link },
      },
    });
    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });
  static getVipLevelsConfig = catchAsync(async (req, res, next) => {
    const heThong = await HeThong.findOne({ systemID: 1 });
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }
    return new OkResponse({
      data: normalizeVipLevels(heThong?.vipLevels ?? DEFAULT_VIP_LEVELS),
    }).send(res);
  });
  static updateVipLevelsConfig = catchAsync(async (req, res, next) => {
    const { vipLevels } = req.body;
    if (!vipLevels || !_.isPlainObject(vipLevels)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const normalized = normalizeVipLevels(vipLevels);
    const heThong = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "vipLevels.vip1.minMoney": normalized.vip1.minMoney,
          "vipLevels.vip1.maxMoney": normalized.vip1.maxMoney,
          "vipLevels.vip2.minMoney": normalized.vip2.minMoney,
          "vipLevels.vip2.maxMoney": normalized.vip2.maxMoney,
          "vipLevels.vip3.minMoney": normalized.vip3.minMoney,
          "vipLevels.vip3.maxMoney": normalized.vip3.maxMoney,
        },
      },
      { new: false }
    );
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }
    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_BOT_TELEGRAM,
      description: `Set cấu hình VIP levels`,
      metadata: {
        before: heThong.vipLevels,
        after: normalized,
      },
    });
    return new OkResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });

  static getBrandingConfig = catchAsync(async (req, res) => {
    const heThong = await HeThong.findOne({ systemID: 1 });
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }
    return new OkResponse({
      data: {
        logoUrl: heThong?.branding?.logoUrl || "",
        banners: heThong?.branding?.banners || [],
      },
    }).send(res);
  });

  static updateBrandingConfig = catchAsync(async (req, res) => {
    const { logoUrl, banners } = req.body;
    if (banners !== undefined && !Array.isArray(banners)) {
      throw new UnauthorizedError("Danh sách banner không hợp lệ");
    }
    const normalizedBanners = Array.isArray(banners)
      ? banners
          .filter((item) => item?.url)
          .map((item) => ({
            url: String(item.url),
            desc: String(item.desc || ""),
            status: item.status !== false,
          }))
      : undefined;

    const update = {};
    if (logoUrl !== undefined) {
      update["branding.logoUrl"] = String(logoUrl || "");
    }
    if (normalizedBanners !== undefined) {
      update["branding.banners"] = normalizedBanners;
    }

    const heThong = await HeThong.findOneAndUpdate({ systemID: 1 }, { $set: update }, { new: false });
    if (!heThong) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_BOT_TELEGRAM,
      description: `Set cấu hình branding logo/banner`,
      metadata: {
        before: heThong.branding,
        after: { logoUrl, banners: normalizedBanners },
      },
    });

    return new OkResponse({
      message: "Cập nhật branding thành công",
    }).send(res);
  });

  static uploadBrandingAsset = catchAsync(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError("Vui lòng chọn file ảnh");
    }
    const url = `/uploads/branding/${req.file.filename}`;
    return new OkResponse({
      message: "Upload thành công",
      data: { url },
    }).send(res);
  });

  static listMediaLibrary = catchAsync(async (req, res) => {
    const items = ["media", "branding", "notifications"]
      .flatMap((folder) => listUploadFolder(folder))
      .sort((a, b) => b.mtimeMs - a.mtimeMs);
    return new OkResponse({
      data: items,
      metadata: { results: items.length },
    }).send(res);
  });

  static uploadMediaAsset = catchAsync(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError("Vui lòng chọn file ảnh");
    }
    const url = `/uploads/media/${req.file.filename}`;
    return new OkResponse({
      message: "Upload thành công",
      data: { url },
    }).send(res);
  });
}

module.exports = HeThongAdminController;
