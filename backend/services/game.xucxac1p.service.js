"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac1P = require("../models/GameXucXac1P");
const LichSuDatCuocXucXac1P = require("../models/LichSuDatCuocXucXac1P");
const GameXucXacService = require("./game.xucxac_.service");

class GameXucXac1PService extends GameXucXacService {
  constructor() {
    const GameXucXac1PSocketService = require("./game.socket.service/game.xucxac1p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xucxac_1p",
      TIME_COUNTDOWN: "timer_xucxac_1p",
      TYPE_GAME: "1P",
      KEY_SOCKET: LOAI_GAME.XUCXAC1P,
    };
    const SETTING_GAME = {
      TIMER: 60,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXucXac1P,
        HISTORY: LichSuDatCuocXucXac1P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac1PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac1PSocketService.sendRoomAdminXucXac,
      },
    };

    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }

  /**
   *
   * @returns {GameXucXac1PService}
   */
  static getInstance = () => {
    if (!GameXucXac1PService.instance) {
      GameXucXac1PService.instance = new GameXucXac1PService();
    }
    return GameXucXac1PService.instance;
  };
}

module.exports = GameXucXac1PService.getInstance();
