"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameKeno5P = require("../models/GameKeno5P");
const LichSuDatCuocKeno5P = require("../models/LichSuDatCuocKeno5P");
const GameKenoService = require("./game.keno_.service");

class GameKeno5PService extends GameKenoService {
  constructor() {
    const GameKeno5PSocketService = require("./game.socket.service/game.keno5p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_keno_5p",
      TIME_COUNTDOWN: "timer_keno_5p",
      TYPE_GAME: "5P",
      KEY_SOCKET: LOAI_GAME.KENO5P,
    };
    const SETTING_GAME = {
      TIMER: 300,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameKeno5P,
        HISTORY: LichSuDatCuocKeno5P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_KENO: GameKeno5PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno5PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameKeno5PService}
   */
  static getInstance = () => {
    if (!GameKeno5PService.instance) {
      GameKeno5PService.instance = new GameKeno5PService();
    }
    return GameKeno5PService.instance;
  };
}

module.exports = GameKeno5PService.getInstance();
