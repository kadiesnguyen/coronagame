"use strict";
const GameKenoSocketService = require("./game.keno.socket.service");
class GameKeno3PSocketService extends GameKenoSocketService {
  static sendRoomKeno = ({ key, data = null }) => {
    global._io.to(GameKeno3PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminKeno = ({ key, data = null }) => {
    global._io.to(GameKeno3PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "keno3p",
    ROOM: "keno3p",
    ADMIN_ROOM: "admin_keno3p",
    KEY_SYSTEM_DB: "keno3P",
    METHOD: {
      SEND_ROOM_KENO: GameKeno3PSocketService.sendRoomKeno,
      SEND_ROOM_ADMIN_KENO: GameKeno3PSocketService.sendRoomAdminKeno,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.keno3p.service");
    super({ CONFIG: GameKeno3PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameKeno3PSocketService;
