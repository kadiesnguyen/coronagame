const GameKeno1P = require("../../models/GameKeno1P");
const LichSuDatCuocKeno1P = require("../../models/LichSuDatCuocKeno1P");
const GameKeno1PSocketService = require("../../services/game.socket.service/game.keno1p.socket.service");
const GameKenoAdminController = require("./game.keno.admin.controller");

class GameKeno1PAdminController extends GameKenoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno1P",
      ROOM: "keno1p",
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
   * @returns {GameKeno1PAdminController}
   */
  static getInstance = () => {
    if (!GameKeno1PAdminController.instance) {
      GameKeno1PAdminController.instance = new GameKeno1PAdminController();
    }
    return GameKeno1PAdminController.instance;
  };
}
module.exports = GameKeno1PAdminController.getInstance();
