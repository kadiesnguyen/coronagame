"use strict";
const GameKenoSocketService = require("./game.keno.socket.service");
class GameKeno10PSocketService extends GameKenoSocketService {
  static sendRoomKeno = ({ key, data = null }) => {
    global._io.to(GameKeno10PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminKeno = ({ key, data = null }) => {
    global._io.to(GameKeno10PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "keno10p",
    ROOM: "keno10p",
    ADMIN_ROOM: "admin_keno10p",
    KEY_SYSTEM_DB: "keno10P",
    METHOD: {
      SEND_ROOM_KENO: GameKeno10PSocketService.sendRoomKeno,
      SEND_ROOM_ADMIN_KENO: GameKeno10PSocketService.sendRoomAdminKeno,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.keno10p.service");
    super({ CONFIG: GameKeno10PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameKeno10PSocketService;
