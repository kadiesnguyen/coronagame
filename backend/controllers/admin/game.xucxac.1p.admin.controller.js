const GameXucXac1P = require("../../models/GameXucXac1P");
const LichSuDatCuocXucXac1P = require("../../models/LichSuDatCuocXucXac1P");
const GameXucXac1PSocketService = require("../../services/game.socket.service/game.xucxac1p.socket.service");
const GameXucXacAdminController = require("./game.xucxac.admin.controller");

class GameXucXac1PAdminController extends GameXucXacAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 1P",
      ROOM: "xucxac1p",
      ADMIN_ROOM: "admin_xucxac1p",
      KEY_SYSTEM_DB: "xucXac1P",
      MODEL: {
        GAME_XUCXAC: GameXucXac1P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXucXac1P,
      },
      METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac1PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac1PSocketService.sendRoomAdminXucXac,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXucXac1PAdminController}
   */
  static getInstance = () => {
    if (!GameXucXac1PAdminController.instance) {
      GameXucXac1PAdminController.instance = new GameXucXac1PAdminController();
    }
    return GameXucXac1PAdminController.instance;
  };
}
module.exports = GameXucXac1PAdminController.getInstance();
