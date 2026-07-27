"use strict";
const GameKenoSocketService = require("./game.keno.socket.service");
class GameKeno1PSocketService extends GameKenoSocketService {
  static sendRoomKeno = ({ key, data = null }) => {
    global._io.to(GameKeno1PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminKeno = ({ key, data = null }) => {
    global._io.to(GameKeno1PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "keno1p",
    ROOM: "keno1p",
    ADMIN_ROOM: "admin_keno1p",
    KEY_SYSTEM_DB: "keno1P",
    METHOD: {
      SEND_ROOM_KENO: GameKeno1PSocketService.sendRoomKeno,
      SEND_ROOM_ADMIN_KENO: GameKeno1PSocketService.sendRoomAdminKeno,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.keno1p.service");
    super({ CONFIG: GameKeno1PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameKeno1PSocketService;
