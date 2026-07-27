"use strict";
const GameXoSoSocketService = require("./game.xoso.socket.service");
class GameXoSo5PSocketService extends GameXoSoSocketService {
  static sendRoomXoSo = ({ key, data = null }) => {
    global._io.to(GameXoSo5PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXoSo = ({ key, data = null }) => {
    global._io.to(GameXoSo5PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xoso5p",
    ROOM: "xoso5p",
    ADMIN_ROOM: "admin_xoso5p",
    KEY_SYSTEM_DB: "xoSo5P",
    METHOD: {
      SEND_ROOM_XOSO: GameXoSo5PSocketService.sendRoomXoSo,
      SEND_ROOM_ADMIN_XOSO: GameXoSo5PSocketService.sendRoomAdminXoSo,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xoso5p.service");
    super({ CONFIG: GameXoSo5PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXoSo5PSocketService;
