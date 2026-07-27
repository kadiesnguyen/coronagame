"use strict";
const GameXucXacSocketService = require("./game.xucxac.socket.service");
class GameXucXac3PSocketService extends GameXucXacSocketService {
  static sendRoomXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac3PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac3PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xucxac3p",
    ROOM: "xucxac3p",
    ADMIN_ROOM: "admin_xucxac3p",
    KEY_SYSTEM_DB: "xucXac3P",
    METHOD: {
      SEND_ROOM_XUCXAC: GameXucXac3PSocketService.sendRoomXucXac,
      SEND_ROOM_ADMIN_XUCXAC: GameXucXac3PSocketService.sendRoomAdminXucXac,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xucxac3p.service");
    super({ CONFIG: GameXucXac3PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXucXac3PSocketService;
