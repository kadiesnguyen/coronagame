"use strict";

const HeThong = require("../../models/HeThong");

class GameXoSoMBSocketService {
  static sendRoomXoSo = ({ key, data = null }) => {
    global._io.to(GameXoSoMBSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXoSo = ({ key, data = null }) => {
    global._io.to(GameXoSoMBSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };

  static CONFIG = {
    KEY_SOCKET: "xosomb",
    ROOM: "xosomb",
    ADMIN_ROOM: "admin_xosomb",
    KEY_SYSTEM_DB: "xoSoMB",
    METHOD: {
      SEND_ROOM_XOSO: GameXoSoMBSocketService.sendRoomXoSo,
      SEND_ROOM_ADMIN_XOSO: GameXoSoMBSocketService.sendRoomAdminXoSo,
    },
  };

  constructor(socket) {
    this.CONFIG = GameXoSoMBSocketService.CONFIG;
    this.socket = socket;
    const GameXoSoMBService = require("../game.xsmb.service");
    this.GAME_DATA = GameXoSoMBService;

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:pause-game`, () => {
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      console.log("PAUSE GAME", this.GAME_DATA);
      this.GAME_DATA.setIsPlayGame(false);
    });
    this.socket.on(`${this.CONFIG.KEY_SOCKET}:restart-game`, () => {
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      this.GAME_DATA.setIsPlayGame(true);
    });

    /**
     *
     */

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:join-room`, () => {
      this.socket.join(this.CONFIG.ROOM);
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }

      this.CONFIG.METHOD.SEND_ROOM_XOSO({
        key: `${this.CONFIG.KEY_SOCKET}:timer`,
        data: { timerOpen: this.GAME_DATA.getTimerOpen(), timerStopBet: this.GAME_DATA.getTimerStopBet() },
      });
      this.CONFIG.METHOD.SEND_ROOM_XOSO({
        key: `${this.CONFIG.KEY_SOCKET}:hienThiPhien`,
        data: { currentDate: this.GAME_DATA.getCurrentDate(), latestCompleteDate: this.GAME_DATA.getLatestCompleteDate() },
      });
    });

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:join-room-admin`, () => {
      const { role } = global._io;
      if (role !== "admin") {
        return;
      }
      this.socket.join(this.CONFIG.ADMIN_ROOM);

      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      this.CONFIG.METHOD.SEND_ROOM_XOSO({
        key: `${this.CONFIG.KEY_SOCKET}:admin:timer`,
        data: {
          phien: this.GAME_DATA.getCurrentDate(),
          timerOpen: this.GAME_DATA.getTimerOpen(),
          timerStopBet: this.GAME_DATA.getTimerStopBet(),
        },
      });
    });
  }
}

module.exports = GameXoSoMBSocketService;
