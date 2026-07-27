const GameKeno10P = require("../../models/GameKeno10P");
const LichSuDatCuocKeno10P = require("../../models/LichSuDatCuocKeno10P");
const GameKeno10PSocketService = require("../../services/game.socket.service/game.keno10p.socket.service");
const GameKenoAdminController = require("./game.keno.admin.controller");

class GameKeno10PAdminController extends GameKenoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Keno10P",
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
