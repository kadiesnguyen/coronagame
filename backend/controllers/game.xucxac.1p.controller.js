const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac1P = require("../models/GameXucXac1P");
const LichSuDatCuocXucXac1P = require("../models/LichSuDatCuocXucXac1P");
const GameXucXac1PSocketService = require("../services/game.socket.service/game.xucxac1p.socket.service");
const GameXucXacController = require("./game.xucxac.controller");

class GameXucXac1PController extends GameXucXacController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 1P",
      ROOM: LOAI_GAME.XUCXAC1P,
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
   * @returns {GameXucXac1PController}
   */
  static getInstance = () => {
    if (!GameXucXac1PController.instance) {
      GameXucXac1PController.instance = new GameXucXac1PController();
    }
    return GameXucXac1PController.instance;
  };
}
module.exports = GameXucXac1PController.getInstance();
