const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac10P = require("../models/GameXucXac10P");
const HeThong = require("../models/HeThong");
const LichSuDatCuocXucXac10P = require("../models/LichSuDatCuocXucXac10P");
const GameXucXac10PSocketService = require("../services/game.socket.service/game.xucxac10p.socket.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");
const { DEFAULT_XUCXAC10P_TI_LE_VIP, normalizeTiLeVip, resolveTiLeByVipLevel } = require("../utils/vip");
const GameXucXacController = require("./game.xucxac.controller");

class GameXucXac10PController extends GameXucXacController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 10P",
      ROOM: LOAI_GAME.XUCXAC10P,
      ADMIN_ROOM: "admin_xucxac10p",
      KEY_SYSTEM_DB: "xucXac10P",
      REQUIRE_VIP_LEVEL: true,
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
    const tiLeVip = normalizeTiLeVip(config?.tiLeVip ?? DEFAULT_XUCXAC10P_TI_LE_VIP, DEFAULT_XUCXAC10P_TI_LE_VIP);
    const vipLevel = Number(req.query.vipLevel);
    if ([1, 2, 3].includes(vipLevel)) {
      return new OkResponse({
        data: resolveTiLeByVipLevel(vipLevel, tiLeVip, config?.tiLeCLTX, DEFAULT_XUCXAC10P_TI_LE_VIP),
      }).send(res);
    }
    return new OkResponse({
      data: tiLeVip,
    }).send(res);
  });

  /**
   *
   * @returns {GameXucXac10PController}
   */
  static getInstance = () => {
    if (!GameXucXac10PController.instance) {
      GameXucXac10PController.instance = new GameXucXac10PController();
    }
    return GameXucXac10PController.instance;
  };
}
module.exports = GameXucXac10PController.getInstance();
