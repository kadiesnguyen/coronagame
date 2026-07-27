const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const HeThong = require("../../models/HeThong");
const GameXucXac10P = require("../../models/GameXucXac10P");
const LichSuDatCuocXucXac10P = require("../../models/LichSuDatCuocXucXac10P");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const GameXucXac10PSocketService = require("../../services/game.socket.service/game.xucxac10p.socket.service");
const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { OkResponse } = require("../../utils/successResponse");
const { DEFAULT_XUCXAC10P_TI_LE_VIP, normalizeTiLeVip } = require("../../utils/vip");
const GameXucXacAdminController = require("./game.xucxac.admin.controller");

class GameXucXac10PAdminController extends GameXucXacAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 10P",
      ROOM: "xucxac10p",
      ADMIN_ROOM: "admin_xucxac10p",
      KEY_SYSTEM_DB: "xucXac10P",
      MODEL: {
        GAME_XUCXAC: GameXucXac10P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXucXac10P,
      },
      METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac10PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac10PSocketService.sendRoomAdminXucXac,
      },
    };
    super({
      CONFIG,
    });
  }

  getTiLeGame = catchAsync(async (req, res) => {
    const results = await HeThong.findOne({ systemID: 1 });
    const config = results?.gameConfigs?.xucXacConfigs?.xucXac10P;
    return new OkResponse({
      data: normalizeTiLeVip(config?.tiLeVip ?? DEFAULT_XUCXAC10P_TI_LE_VIP, DEFAULT_XUCXAC10P_TI_LE_VIP),
    }).send(res);
  });

  setTiLeGame = catchAsync(async (req, res) => {
    const { tiLe, tiLeVip } = req.body;
    const source = tiLeVip ?? tiLe;
    if (!source || typeof source !== "object") {
      throw new UnauthorizedError("Vui lòng nhập tỉ lệ VIP1/VIP2/VIP3");
    }
    const normalized = normalizeTiLeVip(source, DEFAULT_XUCXAC10P_TI_LE_VIP);
    if (normalized.vip1 < 0 || normalized.vip2 < 0 || normalized.vip3 < 0) {
      throw new BadRequestError("Tỉ lệ không hợp lệ");
    }

    const result = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeVip.vip1": normalized.vip1,
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeVip.vip2": normalized.vip2,
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeVip.vip3": normalized.vip3,
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeCLTX": normalized.vip1,
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
      description: `Set tỉ lệ VIP game xucxac10P`,
      metadata: {
        tiLeBefore: result.gameConfigs?.xucXacConfigs?.xucXac10P?.tiLeVip,
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
   * @returns {GameXucXac10PAdminController}
   */
  static getInstance = () => {
    if (!GameXucXac10PAdminController.instance) {
      GameXucXac10PAdminController.instance = new GameXucXac10PAdminController();
    }
    return GameXucXac10PAdminController.instance;
  };
}
module.exports = GameXucXac10PAdminController.getInstance();
