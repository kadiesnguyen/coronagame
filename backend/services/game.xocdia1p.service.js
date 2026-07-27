"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXocDia1P = require("../models/GameXocDia1P");
const LichSuDatCuocXocDia1P = require("../models/LichSuDatCuocXocDia1P");
const GameXocDiaService = require("./game.xocdia_.service");

class GameXocDia1PService extends GameXocDiaService {
  constructor() {
    const GameXocDia1PSocketService = require("./game.socket.service/game.xocdia1p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xocdia_1p",
      TIME_COUNTDOWN: "timer_xocdia_1p",
      TYPE_GAME: "1P",
      KEY_SOCKET: LOAI_GAME.XOCDIA1P,
    };
    const SETTING_GAME = {
      TIMER: 60,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXocDia1P,
        HISTORY: LichSuDatCuocXocDia1P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XOCDIA: GameXocDia1PSocketService.sendRoomXocDia,
        SEND_ROOM_ADMIN_XOCDIA: GameXocDia1PSocketService.sendRoomAdminXocDia,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameXocDia1PService}
   */
  static getInstance = () => {
    if (!GameXocDia1PService.instance) {
      GameXocDia1PService.instance = new GameXocDia1PService();
    }
    return GameXocDia1PService.instance;
  };
}

module.exports = GameXocDia1PService.getInstance();
