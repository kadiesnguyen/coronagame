const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const { CHI_TIET_CUOC_GAME, DEFAULT_SETTING_GAME, LOAI_CUOC_GAME } = require("../../configs/game.xoso");
const GameXoSoMB = require("../../models/GameXoSoMB");
const HeThong = require("../../models/HeThong");
const LichSuDatCuocXoSoMB = require("../../models/LichSuDatCuocXoSoMB");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const GameXoSoMBSocketService = require("../../services/game.socket.service/game.xosomb.socket.service");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../../utils/successResponse");

class GameXoSoMBAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xổ số miền Bắc",
      ROOM: "xosomb",
      ADMIN_ROOM: "admin_xosomb",
      KEY_SYSTEM_DB: "xoSoMB",
      MODEL: {
        GAME_XOSO: GameXoSoMB,
        LICH_SU_DAT_CUOC: LichSuDatCuocXoSoMB,
      },
    };
    this.CONFIG = CONFIG;
  }
  getTiLeGame = catchAsync(async (req, res, next) => {
    const results = await HeThong.findOne({
      systemID: 1,
    });
    const bangTiLe = {
      tiLeLo: results?.gameConfigs?.xoSoConfigs?.[`${this.CONFIG.KEY_SYSTEM_DB}`]?.tiLeLo ?? DEFAULT_SETTING_GAME.LO_BET_PAYOUT_PERCENT,
      tiLeDe: results?.gameConfigs?.xoSoConfigs?.[`${this.CONFIG.KEY_SYSTEM_DB}`]?.tiLeDe ?? DEFAULT_SETTING_GAME.DE_BET_PAYOUT_PERCENT,
      tiLeBaCang:
        results?.gameConfigs?.xoSoConfigs?.[`${this.CONFIG.KEY_SYSTEM_DB}`]?.tiLeBaCang ?? DEFAULT_SETTING_GAME.BA_CANG_BET_PAYOUT_PERCENT,
      tiLeLoXien2:
        results?.gameConfigs?.xoSoConfigs?.[`${this.CONFIG.KEY_SYSTEM_DB}`]?.tiLeLoXien2 ??
        DEFAULT_SETTING_GAME.LO_XIEN_2_BET_PAYOUT_PERCENT,
      tiLeLoXien3:
        results?.gameConfigs?.xoSoConfigs?.[`${this.CONFIG.KEY_SYSTEM_DB}`]?.tiLeLoXien3 ??
        DEFAULT_SETTING_GAME.LO_XIEN_3_BET_PAYOUT_PERCENT,
      tiLeLoXien4:
        results?.gameConfigs?.xoSoConfigs?.[`${this.CONFIG.KEY_SYSTEM_DB}`]?.tiLeLoXien4 ??
        DEFAULT_SETTING_GAME.LO_XIEN_4_BET_PAYOUT_PERCENT,
    };

    return new OkResponse({
      data: bangTiLe,
    }).send(res);
  });

  setTiLeGame = catchAsync(async (req, res, next) => {
    const { tiLe } = req.body;
    if (!tiLe) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    let update = {};

    Object.keys(tiLe).forEach((keyTiLe) => {
      const field = `gameConfigs.xoSoConfigs.${this.CONFIG.KEY_SYSTEM_DB}.${keyTiLe}`;
      update = { ...update, [field]: tiLe[keyTiLe] };
    });

    const result = await HeThong.findOneAndUpdate(
      {
        systemID: 1,
      },
      { $set: update },
      {
        new: false,
      }
    );

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_TI_LE_GAME,
      description: `Set tỉ lệ game ${this.CONFIG.KEY_SYSTEM_DB}`,
      metadata: {
        tiLeBefore: Object.keys(tiLe).map((keyTiLe) => {
          return { [keyTiLe]: result.gameConfigs.xoSoConfigs[`${this.CONFIG.KEY_SYSTEM_DB}`][`${keyTiLe}`] };
        }),
        tiLeAfter: Object.keys(tiLe).map((keyTiLe) => {
          return { [keyTiLe]: tiLe[keyTiLe] };
        }),
      },
    });

    return new OkResponse({
      data: tiLe,
    }).send(res);
  });

  getAllLichSuGame = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    const searchQuery = req.query?.query ?? "";
    let sortValue = ["-openTime"];
    sortValue = sortValue.join(" ");
    let query = {};
    if (searchQuery) {
      query = {
        ngay: {
          $eq: searchQuery,
        },
      };
    }
    const list = await this.CONFIG.MODEL.GAME_XOSO.find(query).skip(skip).limit(results).sort(sortValue).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        searchQuery,
      },
    }).send(res);
  });
  getLichSuGameChiTiet = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await this.CONFIG.MODEL.GAME_XOSO.findOne({
      _id: id,
    }).lean();
    return new OkResponse({
      data: result,
      metadata: {
        id,
      },
    }).send(res);
  });
  countAllGame = catchAsync(async (req, res, next) => {
    const searchQuery = req.query?.query ?? "";
    let query = {};
    if (searchQuery) {
      query = {
        ngay: {
          $eq: searchQuery,
        },
      };
    }

    const countList = await this.CONFIG.MODEL.GAME_XOSO.countDocuments(query);
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  getAllLichSuCuocGame = catchAsync(async (req, res, next) => {
    const { _id: userID } = req.user;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.find({
      nguoiDung: userID,
    })
      .skip(skip)
      .limit(results)
      .sort(sortValue)
      .populate("phien")
      .lean();

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

  getLichSuCuocGameChiTiet = catchAsync(async (req, res, next) => {
    const { phien } = req.params;
    const findPhien = await this.CONFIG.MODEL.GAME_XOSO.findOne({
      _id: phien,
    });
    if (!findPhien) {
      throw new NotFoundError("Không tìm thấy phiên game");
    }

    const list = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.find({
      phien: findPhien._id,
    })
      .populate("nguoiDung")
      .lean();
    return new OkResponse({
      data: list,
    }).send(res);
  });
}
module.exports = GameXoSoMBAdminController;
