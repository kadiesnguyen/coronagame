"use strict";
const GameKenoSocketService = require("./game.keno.socket.service");
class GameKeno5PSocketService extends GameKenoSocketService {
  static sendRoomKeno = ({ key, data = null }) => {
    global._io.to(GameKeno5PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminKeno = ({ key, data = null }) => {
    global._io.to(GameKeno5PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "keno5p",
    ROOM: "keno5p",
    ADMIN_ROOM: "admin_keno5p",
    KEY_SYSTEM_DB: "keno5P",
    METHOD: {
      SEND_ROOM_KENO: GameKeno5PSocketService.sendRoomKeno,
      SEND_ROOM_ADMIN_KENO: GameKeno5PSocketService.sendRoomAdminKeno,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.keno5p.service");
    super({ CONFIG: GameKeno5PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameKeno5PSocketService;
