const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac3P = require("../models/GameXucXac3P");
const LichSuDatCuocXucXac3P = require("../models/LichSuDatCuocXucXac3P");
const GameXucXac3PSocketService = require("../services/game.socket.service/game.xucxac3p.socket.service");
const GameXucXacController = require("./game.xucxac.controller");

class GameXucXac3PController extends GameXucXacController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 3P",
      ROOM: LOAI_GAME.XUCXAC3P,
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
   * @returns {GameXucXac3PController}
   */
  static getInstance = () => {
    if (!GameXucXac3PController.instance) {
      GameXucXac3PController.instance = new GameXucXac3PController();
    }
    return GameXucXac3PController.instance;
  };
}
module.exports = GameXucXac3PController.getInstance();
