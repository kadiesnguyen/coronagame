"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac5P = require("../models/GameXucXac5P");
const LichSuDatCuocXucXac5P = require("../models/LichSuDatCuocXucXac5P");
const GameXucXacService = require("./game.xucxac_.service");

class GameXucXac5PService extends GameXucXacService {
  constructor() {
    const GameXucXac5PSocketService = require("./game.socket.service/game.xucxac5p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xucxac_5p",
      TIME_COUNTDOWN: "timer_xucxac_5p",
      TYPE_GAME: "5P",
      KEY_SOCKET: LOAI_GAME.XUCXAC5P,
    };
    const SETTING_GAME = {
      TIMER: 300,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXucXac5P,
        HISTORY: LichSuDatCuocXucXac5P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac5PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac5PSocketService.sendRoomAdminXucXac,
      },
    };

    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameXucXac5PService}
   */
  static getInstance = () => {
    if (!GameXucXac5PService.instance) {
      GameXucXac5PService.instance = new GameXucXac5PService();
    }
    return GameXucXac5PService.instance;
  };
}

module.exports = GameXucXac5PService.getInstance();
