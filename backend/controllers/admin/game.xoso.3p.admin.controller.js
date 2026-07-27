const GameXoSo3P = require("../../models/GameXoSo3P");
const LichSuDatCuocXoSo3P = require("../../models/LichSuDatCuocXoSo3P");
const GameXoSo3PSocketService = require("../../services/game.socket.service/game.xoso3p.socket.service");
const GameXoSoAdminController = require("./game.xoso.admin.controller");

class GameXoSo3PAdminController extends GameXoSoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xổ số 3P",
      ROOM: "xoso3p",
      ADMIN_ROOM: "admin_xoso3p",
      KEY_SYSTEM_DB: "xoSo3P",
      MODEL: {
        GAME_XOSO: GameXoSo3P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXoSo3P,
      },
      METHOD: {
        SEND_ROOM_XOCDIA: GameXoSo3PSocketService.sendRoomXoSo,
        SEND_ROOM_ADMIN_XOCDIA: GameXoSo3PSocketService.sendRoomAdminXoSo,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXoSo3PAdminController}
   */
  static getInstance = () => {
    if (!GameXoSo3PAdminController.instance) {
      GameXoSo3PAdminController.instance = new GameXoSo3PAdminController();
    }
    return GameXoSo3PAdminController.instance;
  };
}
module.exports = GameXoSo3PAdminController.getInstance();
