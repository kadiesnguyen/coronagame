"use strict";
const GameXucXacSocketService = require("./game.xucxac.socket.service");
class GameXucXac10PSocketService extends GameXucXacSocketService {
  static sendRoomXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac10PSocketService.CONFIG.ROOM).emit(key, data);
  };

  static sendRoomAdminXucXac = ({ key, data = null }) => {
    global._io.to(GameXucXac10PSocketService.CONFIG.ADMIN_ROOM).emit(key, data);
  };
  static CONFIG = {
    KEY_SOCKET: "xucxac10p",
    ROOM: "xucxac10p",
    ADMIN_ROOM: "admin_xucxac10p",
    KEY_SYSTEM_DB: "xucXac10P",
    METHOD: {
      SEND_ROOM_XUCXAC: GameXucXac10PSocketService.sendRoomXucXac,
      SEND_ROOM_ADMIN_XUCXAC: GameXucXac10PSocketService.sendRoomAdminXucXac,
    },
  };

  constructor(socket) {
    const GAME_DATA = require("../game.xucxac10p.service");
    super({ CONFIG: GameXucXac10PSocketService.CONFIG, socket, GAME_DATA });
  }
}

module.exports = GameXucXac10PSocketService;
