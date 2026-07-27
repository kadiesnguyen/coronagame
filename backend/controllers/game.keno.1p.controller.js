const { LOAI_GAME } = require("../configs/game.config");
const GameKeno1P = require("../models/GameKeno1P");
const LichSuDatCuocKeno1P = require("../models/LichSuDatCuocKeno1P");
const GameKeno1PSocketService = require("../services/game.socket.service/game.keno1p.socket.service");
const GameKenoController = require("./game.keno.controller");

class GameKeno1PController extends GameKenoController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno1P",
      ROOM: LOAI_GAME.KENO1P,
      ADMIN_ROOM: "admin_keno1p",
      KEY_SYSTEM_DB: "keno1P",
      MODEL: {
        GAME_KENO: GameKeno1P,
        LICH_SU_DAT_CUOC: LichSuDatCuocKeno1P,
      },
      METHOD: {
        SEND_ROOM_KENO: GameKeno1PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno1PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameKeno1PController}
   */
  static getInstance = () => {
    if (!GameKeno1PController.instance) {
      GameKeno1PController.instance = new GameKeno1PController();
    }
    return GameKeno1PController.instance;
  };
}
module.exports = GameKeno1PController.getInstance();
