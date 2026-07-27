"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameKeno10P = require("../models/GameKeno10P");
const LichSuDatCuocKeno10P = require("../models/LichSuDatCuocKeno10P");
const GameKenoService = require("./game.keno_.service");

class GameKeno10PService extends GameKenoService {
  constructor() {
    const GameKeno10PSocketService = require("./game.socket.service/game.keno10p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_keno_10p",
      TIME_COUNTDOWN: "timer_keno_10p",
      TYPE_GAME: "10P",
      KEY_SOCKET: LOAI_GAME.KENO10P,
    };
    const SETTING_GAME = {
      TIMER: 600,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameKeno10P,
        HISTORY: LichSuDatCuocKeno10P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_KENO: GameKeno10PSocketService.sendRoomKeno,
        SEND_ROOM_ADMIN_KENO: GameKeno10PSocketService.sendRoomAdminKeno,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameKeno10PService}
   */
  static getInstance = () => {
    if (!GameKeno10PService.instance) {
      GameKeno10PService.instance = new GameKeno10PService();
    }
    return GameKeno10PService.instance;
  };
}

module.exports = GameKeno10PService.getInstance();
