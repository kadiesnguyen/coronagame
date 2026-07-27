const { LOAI_GAME } = require("../configs/game.config");
const GameXoSo5P = require("../models/GameXoSo5P");
const LichSuDatCuocXoSo5P = require("../models/LichSuDatCuocXoSo5P");
const GameXoSo5PSocketService = require("../services/game.socket.service/game.xoso5p.socket.service");
const GameXoSoController = require("./game.xoso.controller");

class GameXoSo5PController extends GameXoSoController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xổ Số 5P",
      ROOM: LOAI_GAME.XOSO5P,
      ADMIN_ROOM: "admin_xoso5p",
      KEY_SYSTEM_DB: "xoSo5P",
      MODEL: {
        GAME_XOSO: GameXoSo5P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXoSo5P,
      },
      METHOD: {
        SEND_ROOM_XOSO: GameXoSo5PSocketService.sendRoomXoSo,
        SEND_ROOM_ADMIN_XOSO: GameXoSo5PSocketService.sendRoomAdminXoSo,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXoSo5PController}
   */
  static getInstance = () => {
    if (!GameXoSo5PController.instance) {
      GameXoSo5PController.instance = new GameXoSo5PController();
    }
    return GameXoSo5PController.instance;
  };
}
module.exports = GameXoSo5PController.getInstance();
