"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXucXac10P = require("../models/GameXucXac10P");
const LichSuDatCuocXucXac10P = require("../models/LichSuDatCuocXucXac10P");
const GameXucXacService = require("./game.xucxac_.service");

class GameXucXac10PService extends GameXucXacService {
  constructor() {
    const GameXucXac10PSocketService = require("./game.socket.service/game.xucxac10p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xucxac_10p",
      TIME_COUNTDOWN: "timer_xucxac_10p",
      TYPE_GAME: "10P",
      KEY_SOCKET: LOAI_GAME.XUCXAC10P,
    };
    const SETTING_GAME = {
      TIMER: 600,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXucXac10P,
        HISTORY: LichSuDatCuocXucXac10P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac10PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac10PSocketService.sendRoomAdminXucXac,
      },
    };

    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameXucXac10PService}
   */
  static getInstance = () => {
    if (!GameXucXac10PService.instance) {
      GameXucXac10PService.instance = new GameXucXac10PService();
    }
    return GameXucXac10PService.instance;
  };
}

module.exports = GameXucXac10PService.getInstance();
