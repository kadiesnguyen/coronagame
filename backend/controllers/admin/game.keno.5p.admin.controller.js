const GameKeno5P = require("../../models/GameKeno5P");
const LichSuDatCuocKeno5P = require("../../models/LichSuDatCuocKeno5P");
const GameKeno5PSocketService = require("../../services/game.socket.service/game.keno5p.socket.service");
const GameKenoAdminController = require("./game.keno.admin.controller");

class GameKeno5PAdminController extends GameKenoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno5P",
      ROOM: "keno5p",
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
   * @returns {GameKeno5PAdminController}
   */
  static getInstance = () => {
    if (!GameKeno5PAdminController.instance) {
      GameKeno5PAdminController.instance = new GameKeno5PAdminController();
    }
    return GameKeno5PAdminController.instance;
  };
}
module.exports = GameKeno5PAdminController.getInstance();
