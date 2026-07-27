const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const HeThong = require("../../models/HeThong");
const GameKeno10P = require("../../models/GameKeno10P");
const LichSuDatCuocKeno10P = require("../../models/LichSuDatCuocKeno10P");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const GameKeno10PSocketService = require("../../services/game.socket.service/game.keno10p.socket.service");
const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { OkResponse } = require("../../utils/successResponse");
const { DEFAULT_KENO10P_TI_LE_VIP, normalizeTiLeVip } = require("../../utils/vip");
const GameKenoAdminController = require("./game.keno.admin.controller");

class GameKeno10PAdminController extends GameKenoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno 10P",
      ROOM: "keno10p",
      ADMIN_ROOM: "admin_keno10p",
      KEY_SYSTEM_DB: "keno10P",
      MODEL: {
        GAME_KENO: GameKeno10P,
        LICH_SU_DAT_CUOC: LichSuDatCuocKeno10P,
      },
      METHOD: {
        SEND_ROOM_KENO: GameKeno10PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno10PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      CONFIG,
    });
  }

  getTiLeGame = catchAsync(async (req, res) => {
    const results = await HeThong.findOne({ systemID: 1 });
    const config = results?.gameConfigs?.kenoConfigs?.keno10P;
    return new OkResponse({
      data: normalizeTiLeVip(config?.tiLeVip ?? DEFAULT_KENO10P_TI_LE_VIP),
    }).send(res);
  });

  setTiLeGame = catchAsync(async (req, res) => {
    const { tiLe, tiLeVip } = req.body;
    const source = tiLeVip ?? tiLe;
    if (!source || typeof source !== "object") {
      throw new UnauthorizedError("Vui lòng nhập tỉ lệ VIP1/VIP2/VIP3");
    }
    const normalized = normalizeTiLeVip(source);
    if (normalized.vip1 < 0 || normalized.vip2 < 0 || normalized.vip3 < 0) {
      throw new BadRequestError("Tỉ lệ không hợp lệ");
    }

    const result = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "gameConfigs.kenoConfigs.keno10P.tiLeVip.vip1": normalized.vip1,
          "gameConfigs.kenoConfigs.keno10P.tiLeVip.vip2": normalized.vip2,
          "gameConfigs.kenoConfigs.keno10P.tiLeVip.vip3": normalized.vip3,
          "gameConfigs.kenoConfigs.keno10P.tiLeCLTX": normalized.vip1,
        },
      },
      { new: false }
    ).lean();

    if (!result) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_TI_LE_GAME,
      description: `Set tỉ lệ VIP game keno10P`,
      metadata: {
        tiLeBefore: result.gameConfigs?.kenoConfigs?.keno10P?.tiLeVip,
        tiLeAfter: normalized,
      },
    });

    return new OkResponse({
      data: normalized,
      message: "Cập nhật tỉ lệ VIP thành công",
    }).send(res);
  });

  /**
   *
   * @returns {GameKeno10PAdminController}
   */
  static getInstance = () => {
    if (!GameKeno10PAdminController.instance) {
      GameKeno10PAdminController.instance = new GameKeno10PAdminController();
    }
    return GameKeno10PAdminController.instance;
  };
}
module.exports = GameKeno10PAdminController.getInstance();
