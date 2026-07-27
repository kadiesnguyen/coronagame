const { LOAI_GAME } = require("../configs/game.config");
const GameKeno10P = require("../models/GameKeno10P");
const HeThong = require("../models/HeThong");
const LichSuDatCuocKeno10P = require("../models/LichSuDatCuocKeno10P");
const GameKeno10PSocketService = require("../services/game.socket.service/game.keno10p.socket.service");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");
const { DEFAULT_KENO10P_TI_LE_VIP, normalizeTiLeVip, resolveTiLeByVipLevel } = require("../utils/vip");
const GameKenoController = require("./game.keno.controller");

class GameKeno10PController extends GameKenoController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno 10P",
      ROOM: LOAI_GAME.KENO10P,
      ADMIN_ROOM: "admin_keno10p",
      KEY_SYSTEM_DB: "keno10P",
      REQUIRE_VIP_LEVEL: true,
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
    const tiLeVip = normalizeTiLeVip(config?.tiLeVip ?? DEFAULT_KENO10P_TI_LE_VIP);
    const vipLevel = Number(req.query.vipLevel);
    if ([1, 2, 3].includes(vipLevel)) {
      return new OkResponse({
        data: resolveTiLeByVipLevel(vipLevel, tiLeVip, config?.tiLeCLTX),
      }).send(res);
    }
    return new OkResponse({
      data: tiLeVip,
    }).send(res);
  });

  /**
   *
   * @returns {GameKeno10PController}
   */
  static getInstance = () => {
    if (!GameKeno10PController.instance) {
      GameKeno10PController.instance = new GameKeno10PController();
    }
    return GameKeno10PController.instance;
  };
}
module.exports = GameKeno10PController.getInstance();
