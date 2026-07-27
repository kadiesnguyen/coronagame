const GameXoSo5P = require("../../models/GameXoSo5P");
const LichSuDatCuocXoSo5P = require("../../models/LichSuDatCuocXoSo5P");
const GameXoSo5PSocketService = require("../../services/game.socket.service/game.xoso5p.socket.service");
const GameXoSoAdminController = require("./game.xoso.admin.controller");

class GameXoSo5PAdminController extends GameXoSoAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xổ số 5P",
      ROOM: "xoso5p",
      ADMIN_ROOM: "admin_xoso5p",
      KEY_SYSTEM_DB: "xoSo5P",
      MODEL: {
        GAME_XOSO: GameXoSo5P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXoSo5P,
      },
      METHOD: {
        SEND_ROOM_XOCDIA: GameXoSo5PSocketService.sendRoomXoSo,
        SEND_ROOM_ADMIN_XOCDIA: GameXoSo5PSocketService.sendRoomAdminXoSo,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXoSo5PAdminController}
   */
  static getInstance = () => {
    if (!GameXoSo5PAdminController.instance) {
      GameXoSo5PAdminController.instance = new GameXoSo5PAdminController();
    }
    return GameXoSo5PAdminController.instance;
  };
}
module.exports = GameXoSo5PAdminController.getInstance();
