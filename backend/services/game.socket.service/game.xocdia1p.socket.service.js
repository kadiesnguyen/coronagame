"use strict";
const GameXocDiaSocketService = require("./game.xocdia.socket.service");
class GameXocDia1PSocketService extends GameXocDiaSocketService {
  static sendRoomXocDia = ({ key, data = null }) => {
    global._io.to(GameXocDia1PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXocDia = ({ key, data = null }) => {
    global._io.to(GameXocDia1PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xocdia1p",
    ROOM: "xocdia1p",
    ADMIN_ROOM: "admin_xocdia1p",
    KEY_SYSTEM_DB: "xocDia1P",
    METHOD: {
      SEND_ROOM_XOCDIA: GameXocDia1PSocketService.sendRoomXocDia,
      SEND_ROOM_ADMIN_XOCDIA: GameXocDia1PSocketService.sendRoomAdminXocDia,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xocdia1p.service");
    super({ CONFIG: GameXocDia1PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXocDia1PSocketService;
