"use strict";
const { LOAI_GAME } = require("../configs/game.config");
const GameXoSo5P = require("../models/GameXoSo5P");
const LichSuDatCuocXoSo5P = require("../models/LichSuDatCuocXoSo5P");
const GameXoSoService = require("./game.xoso.service");

class GameXoSo5PService extends GameXoSoService {
  constructor() {
    const GameXoSo5PSocketService = require("./game.socket.service/game.xoso5p.socket.service");

    const KEY_GAME = {
      PHIEN: "phien_xoso_5p",
      TIME_COUNTDOWN: "timer_xoso_5p",
      TYPE_GAME: "5P",
      KEY_SOCKET: LOAI_GAME.XOSO5P,
    };
    const SETTING_GAME = {
      TIMER: 300,
      IS_PLAY_GAME: true,
      IS_MODIFIED_RESULT: false,
      MODIFIED_RESULT: [0, 0, 0, 0],
      IS_AUTO_RESULT: false,
      DATABASE_MODEL: {
        GAME: GameXoSo5P,
        HISTORY: LichSuDatCuocXoSo5P,
      },
      SOCKET_SERVICE_METHOD: {
        SEND_ROOM_XOSO: GameXoSo5PSocketService.sendRoomXoSo,
        SEND_ROOM_ADMIN_XOSO: GameXoSo5PSocketService.sendRoomAdminXoSo,
      },
    };
    super({
      KEY_GAME,
      SETTING_GAME,
    });
  }
  /**
   *
   * @returns {GameXoSo5PService}
   */
  static getInstance = () => {
    if (!GameXoSo5PService.instance) {
      GameXoSo5PService.instance = new GameXoSo5PService();
    }
    return GameXoSo5PService.instance;
  };
}

module.exports = GameXoSo5PService.getInstance();
