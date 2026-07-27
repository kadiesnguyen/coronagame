"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac3P = require("../models/GameXucXac3P");
const LichSuDatCuocXucXac3P = require("../models/LichSuDatCuocXucXac3P");
const GameXucXacService = require("./game.xucxac_.service");

class GameXucXac3PService extends GameXucXacService {
  constructor() {
    const GameXucXac3PSocketService = require("./game.socket.service/game.xucxac3p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xucxac_3p",
      TIME_COUNTDOWN: "timer_xucxac_3p",
      TYPE_GAME: "3P",
      KEY_SOCKET: LOAI_GAME.XUCXAC3P,
    };
    const SETTING_GAME = {
      TIMER: 180,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXucXac3P,
        HISTORY: LichSuDatCuocXucXac3P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac3PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac3PSocketService.sendRoomAdminXucXac,
      },
    };

    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameXucXac3PService}
   */
  static getInstance = () => {
    if (!GameXucXac3PService.instance) {
      GameXucXac3PService.instance = new GameXucXac3PService();
    }
    return GameXucXac3PService.instance;
  };
}

module.exports = GameXucXac3PService.getInstance();
