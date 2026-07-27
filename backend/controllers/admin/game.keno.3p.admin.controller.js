const GameKeno3P = require("../../models/GameKeno3P");
const LichSuDatCuocKeno3P = require("../../models/LichSuDatCuocKeno3P");
const GameKeno3PSocketService = require("../../services/game.socket.service/game.keno3p.socket.service");
const GameKenoAdminController = require("./game.keno.admin.controller");

class GameKeno3PAdminController extends GameKenoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno3P",
      ROOM: "keno3p",
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
   * @returns {GameKeno3PAdminController}
   */
  static getInstance = () => {
    if (!GameKeno3PAdminController.instance) {
      GameKeno3PAdminController.instance = new GameKeno3PAdminController();
    }
    return GameKeno3PAdminController.instance;
  };
}
module.exports = GameKeno3PAdminController.getInstance();
