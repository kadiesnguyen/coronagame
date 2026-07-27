"use strict";
const GameXoSoSocketService = require("./game.xoso.socket.service");
class GameXoSo3PSocketService extends GameXoSoSocketService {
  static sendRoomXoSo = ({ key, data = null }) => {
    global._io.to(GameXoSo3PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXoSo = ({ key, data = null }) => {
    global._io.to(GameXoSo3PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xoso3p",
    ROOM: "xoso3p",
    ADMIN_ROOM: "admin_xoso3p",
    KEY_SYSTEM_DB: "xoSo3P",
    METHOD: {
      SEND_ROOM_XOSO: GameXoSo3PSocketService.sendRoomXoSo,
      SEND_ROOM_ADMIN_XOSO: GameXoSo3PSocketService.sendRoomAdminXoSo,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xoso3p.service");
    super({ CONFIG: GameXoSo3PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXoSo3PSocketService;
