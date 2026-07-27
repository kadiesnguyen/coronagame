"use strict";

const { KEYS_SOCKET_ADMIN } = require("../configs/admin.socket");

class AdminSocketService {
  static CONFIG = {
    ROOM: "ADMIN_ROOM",
  };
  // List users online
  static LIST_USERS_SOCKET = {};

  static sendRoomAdmin = ({ key, data = null }) => {
    global._io.to(AdminSocketService.CONFIG.ROOM).emit(key, data);
  };

  constructor(socket) {
    this.socket = socket;
    this.socket.on(KEYS_SOCKET_ADMIN.JOIN_ROOM_ADMIN, () => {
      const { role } = global._io;
      if (role !== "admin") {
        return;
      }
      this.socket.join(AdminSocketService.CONFIG.ROOM);

      // Send list users online
      AdminSocketService.sendRoomAdmin({
        key: KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE,
        data: Object.keys(AdminSocketService.LIST_USERS_SOCKET),
      });
    });
  }
}

module.exports = AdminSocketService;
