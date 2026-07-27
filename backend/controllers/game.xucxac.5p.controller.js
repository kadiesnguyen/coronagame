const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac5P = require("../models/GameXucXac5P");
const LichSuDatCuocXucXac5P = require("../models/LichSuDatCuocXucXac5P");
const GameXucXac5PSocketService = require("../services/game.socket.service/game.xucxac5p.socket.service");
const GameXucXacController = require("./game.xucxac.controller");

class GameXucXac5PController extends GameXucXacController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 5P",
      ROOM: LOAI_GAME.XUCXAC5P,
      ADMIN_ROOM: "admin_xucxac5p",
      KEY_SYSTEM_DB: "xucXac5P",
      MODEL: {
        GAME_XUCXAC: GameXucXac5P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXucXac5P,
      },
      METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac5PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac5PSocketService.sendRoomAdminXucXac,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXucXac5PController}
   */
  static getInstance = () => {
    if (!GameXucXac5PController.instance) {
      GameXucXac5PController.instance = new GameXucXac5PController();
    }
    return GameXucXac5PController.instance;
  };
}
module.exports = GameXucXac5PController.getInstance();
