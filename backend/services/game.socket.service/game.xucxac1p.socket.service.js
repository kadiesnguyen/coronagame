"use strict";
const GameXucXacSocketService = require("./game.xucxac.socket.service");
class GameXucXac1PSocketService extends GameXucXacSocketService {
  static sendRoomXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac1PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac1PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xucxac1p",
    ROOM: "xucxac1p",
    ADMIN_ROOM: "admin_xucxac1p",
    KEY_SYSTEM_DB: "xucXac1P",
    METHOD: {
      SEND_ROOM_XUCXAC: GameXucXac1PSocketService.sendRoomXucXac,
      SEND_ROOM_ADMIN_XUCXAC: GameXucXac1PSocketService.sendRoomAdminXucXac,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xucxac1p.service");
    super({ CONFIG: GameXucXac1PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXucXac1PSocketService;
