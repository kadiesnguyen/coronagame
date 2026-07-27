const GameXocDia1P = require("../../models/GameXocDia1P");
const LichSuDatCuocXocDia1P = require("../../models/LichSuDatCuocXocDia1P");
const GameXocDia1PSocketService = require("../../services/game.socket.service/game.xocdia1p.socket.service");
const GameXocDiaAdminController = require("./game.xocdia.admin.controller");

class GameXocDia1PAdminController extends GameXocDiaAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xóc Đĩa 1P",
      ROOM: "xocdia1p",
      ADMIN_ROOM: "admin_xocdia1p",
      KEY_SYSTEM_DB: "xocDia1P",
      MODEL: {
        GAME_XOCDIA: GameXocDia1P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXocDia1P,
      },
      METHOD: {
        SEND_ROOM_XOCDIA: GameXocDia1PSocketService.sendRoomXocDia,
        SEND_ROOM_ADMIN_XOCDIA: GameXocDia1PSocketService.sendRoomAdminXocDia,
      },
    };
    super({
      CONFIG,
    });
  }
  /**
   *
   * @returns {GameXocDia1PAdminController}
   */
  static getInstance = () => {
    if (!GameXocDia1PAdminController.instance) {
      GameXocDia1PAdminController.instance = new GameXocDia1PAdminController();
    }
    return GameXocDia1PAdminController.instance;
  };
}
module.exports = GameXocDia1PAdminController.getInstance();
