"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameKeno3P = require("../models/GameKeno3P");
const LichSuDatCuocKeno3P = require("../models/LichSuDatCuocKeno3P");
const GameKenoService = require("./game.keno_.service");

class GameKeno3PService extends GameKenoService {
  constructor() {
    const GameKeno3PSocketService = require("./game.socket.service/game.keno3p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_keno_3p",
      TIME_COUNTDOWN: "timer_keno_3p",
      TYPE_GAME: "3P",
      KEY_SOCKET: LOAI_GAME.KENO3P,
    };
    const SETTING_GAME = {
      TIMER: 180,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameKeno3P,
        HISTORY: LichSuDatCuocKeno3P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_KENO: GameKeno3PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno3PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameKeno3PService}
   */
  static getInstance = () => {
    if (!GameKeno3PService.instance) {
      GameKeno3PService.instance = new GameKeno3PService();
    }
    return GameKeno3PService.instance;
  };
}

module.exports = GameKeno3PService.getInstance();
