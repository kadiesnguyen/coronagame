"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameKeno1P = require("../models/GameKeno1P");
const LichSuDatCuocKeno1P = require("../models/LichSuDatCuocKeno1P");
const GameKenoService = require("./game.keno_.service");

class GameKeno1PService extends GameKenoService {
  constructor() {
    const GameKeno1PSocketService = require("./game.socket.service/game.keno1p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_keno_1p",
      TIME_COUNTDOWN: "timer_keno_1p",
      TYPE_GAME: "1P",
      KEY_SOCKET: LOAI_GAME.KENO1P,
    };
    const SETTING_GAME = {
      TIMER: 60,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameKeno1P,
        HISTORY: LichSuDatCuocKeno1P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_KENO: GameKeno1PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno1PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameKeno1PService}
   */
  static getInstance = () => {
    if (!GameKeno1PService.instance) {
      GameKeno1PService.instance = new GameKeno1PService();
    }
    return GameKeno1PService.instance;
  };
}

module.exports = GameKeno1PService.getInstance();
