"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXoSo3P = require("../models/GameXoSo3P");
const LichSuDatCuocXoSo3P = require("../models/LichSuDatCuocXoSo3P");
const GameXoSoService = require("./game.xoso.service");

class GameXoSo3PService extends GameXoSoService {
  constructor() {
    const GameXoSo3PSocketService = require("./game.socket.service/game.xoso3p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xoso_3p",
      TIME_COUNTDOWN: "timer_xoso_3p",
      TYPE_GAME: "3P",
      KEY_SOCKET: LOAI_GAME.XOSO3P,
    };
    const SETTING_GAME = {
      TIMER: 180,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXoSo3P,
        HISTORY: LichSuDatCuocXoSo3P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XOSO: GameXoSo3PSocketService.sendRoomXoSo,
        SEND_ROOM_ADMIN_XOSO: GameXoSo3PSocketService.sendRoomAdminXoSo,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameXoSo3PService}
   */
  static getInstance = () => {
    if (!GameXoSo3PService.instance) {
      GameXoSo3PService.instance = new GameXoSo3PService();
    }
    return GameXoSo3PService.instance;
  };
}

module.exports = GameXoSo3PService.getInstance();
