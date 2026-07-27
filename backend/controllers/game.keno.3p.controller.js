const { LOAI_GAME } = require("../configs/game.config");
const GameKeno3P = require("../models/GameKeno3P");
const LichSuDatCuocKeno3P = require("../models/LichSuDatCuocKeno3P");
const GameKeno3PSocketService = require("../services/game.socket.service/game.keno3p.socket.service");
const GameKenoController = require("./game.keno.controller");

class GameKeno3PController extends GameKenoController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno3P",
      ROOM: LOAI_GAME.KENO3P,
      ADMIN_ROOM: "admin_keno3p",
      KEY_SYSTEM_DB: "keno3P",
      MODEL: {
        GAME_KENO: GameKeno3P,
        LICH_SU_DAT_CUOC: LichSuDatCuocKeno3P,
      },
      METHOD: {
        SEND_ROOM_KENO: GameKeno3PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno3PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameKeno3PController}
   */
  static getInstance = () => {
    if (!GameKeno3PController.instance) {
      GameKeno3PController.instance = new GameKeno3PController();
    }
    return GameKeno3PController.instance;
  };
}
module.exports = GameKeno3PController.getInstance();
