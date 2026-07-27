const { LOAI_GAME } = require("../configs/game.config");
const GameXoSo3P = require("../models/GameXoSo3P");
const LichSuDatCuocXoSo3P = require("../models/LichSuDatCuocXoSo3P");
const GameXoSo3PSocketService = require("../services/game.socket.service/game.xoso3p.socket.service");
const GameXoSoController = require("./game.xoso.controller");

class GameXoSo3PController extends GameXoSoController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xổ Số 3P",
      ROOM: LOAI_GAME.XOSO3P,
      ADMIN_ROOM: "admin_xoso3p",
      KEY_SYSTEM_DB: "xoSo3P",
      MODEL: {
        GAME_XOSO: GameXoSo3P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXoSo3P,
      },
      METHOD: {
        SEND_ROOM_XOSO: GameXoSo3PSocketService.sendRoomXoSo,
        SEND_ROOM_ADMIN_XOSO: GameXoSo3PSocketService.sendRoomAdminXoSo,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXoSo3PController}
   */
  static getInstance = () => {
    if (!GameXoSo3PController.instance) {
      GameXoSo3PController.instance = new GameXoSo3PController();
    }
    return GameXoSo3PController.instance;
  };
}
module.exports = GameXoSo3PController.getInstance();
