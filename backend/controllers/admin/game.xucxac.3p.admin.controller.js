const GameXucXac3P = require("../../models/GameXucXac3P");
const LichSuDatCuocXucXac3P = require("../../models/LichSuDatCuocXucXac3P");
const GameXucXac3PSocketService = require("../../services/game.socket.service/game.xucxac3p.socket.service");
const GameXucXacAdminController = require("./game.xucxac.admin.controller");

class GameXucXac3PAdminController extends GameXucXacAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 3P",
      ROOM: "xucxac3p",
      ADMIN_ROOM: "admin_xucxac3p",
      KEY_SYSTEM_DB: "xucXac3P",
      MODEL: {
        GAME_XUCXAC: GameXucXac3P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXucXac3P,
      },
      METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac3PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac3PSocketService.sendRoomAdminXucXac,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXucXac3PAdminController}
   */
  static getInstance = () => {
    if (!GameXucXac3PAdminController.instance) {
      GameXucXac3PAdminController.instance = new GameXucXac3PAdminController();
    }
    return GameXucXac3PAdminController.instance;
  };
}
module.exports = GameXucXac3PAdminController.getInstance();
