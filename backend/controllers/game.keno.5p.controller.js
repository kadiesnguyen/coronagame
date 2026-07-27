const { LOAI_GAME } = require("../configs/game.config");
const GameKeno5P = require("../models/GameKeno5P");
const LichSuDatCuocKeno5P = require("../models/LichSuDatCuocKeno5P");
const GameKeno5PSocketService = require("../services/game.socket.service/game.keno5p.socket.service");
const GameKenoController = require("./game.keno.controller");

class GameKeno5PController extends GameKenoController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno5P",
      ROOM: LOAI_GAME.KENO5P,
      ADMIN_ROOM: "admin_keno5p",
      KEY_SYSTEM_DB: "keno5P",
      MODEL: {
        GAME_KENO: GameKeno5P,
        LICH_SU_DAT_CUOC: LichSuDatCuocKeno5P,
      },
      METHOD: {
        SEND_ROOM_KENO: GameKeno5PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno5PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameKeno5PController}
   */
  static getInstance = () => {
    if (!GameKeno5PController.instance) {
      GameKeno5PController.instance = new GameKeno5PController();
    }
    return GameKeno5PController.instance;
  };
}
module.exports = GameKeno5PController.getInstance();
