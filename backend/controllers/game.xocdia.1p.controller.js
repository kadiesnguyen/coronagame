const { LOAI_GAME } = require("../configs/game.config");
const GameXocDia1P = require("../models/GameXocDia1P");
const LichSuDatCuocXocDia1P = require("../models/LichSuDatCuocXocDia1P");
const GameXocDia1PSocketService = require("../services/game.socket.service/game.xocdia1p.socket.service");
const GameXocDiaController = require("./game.xocdia.controller");

class GameXocDia1PController extends GameXocDiaController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xóc Đĩa 1P",
      ROOM: LOAI_GAME.XOCDIA1P,
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
   * @returns {GameXocDia1PController}
   */
  static getInstance = () => {
    if (!GameXocDia1PController.instance) {
      GameXocDia1PController.instance = new GameXocDia1PController();
    }
    return GameXocDia1PController.instance;
  };
}
module.exports = GameXocDia1PController.getInstance();
