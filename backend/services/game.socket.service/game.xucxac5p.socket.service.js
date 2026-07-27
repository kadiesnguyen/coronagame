"use strict";
const GameXucXacSocketService = require("./game.xucxac.socket.service");
class GameXucXac5PSocketService extends GameXucXacSocketService {
  static sendRoomXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac5PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac5PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xucxac5p",
    ROOM: "xucxac5p",
    ADMIN_ROOM: "admin_xucxac5p",
    KEY_SYSTEM_DB: "xucXac5P",
    METHOD: {
      SEND_ROOM_XUCXAC: GameXucXac5PSocketService.sendRoomXucXac,
      SEND_ROOM_ADMIN_XUCXAC: GameXucXac5PSocketService.sendRoomAdminXucXac,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xucxac5p.service");
    super({ CONFIG: GameXucXac5PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXucXac5PSocketService;
