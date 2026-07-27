"use strict";

const { KEYS_SOCKET_ADMIN, GAME_PLAYER_ROOMS } = require("../configs/admin.socket");
const { isAdminSocket } = require("../utils/socket_auth");

class AdminSocketService {
  static CONFIG = {
    ROOM: "ADMIN_ROOM",
  };
  static LIST_USERS_SOCKET = {};
  static _roomCountTimer = null;
  /** room -> { phien, count } — cược trong phiên hiện tại */
  static GAME_BET_ALERTS = {};

  static sendRoomAdmin = ({ key, data = null }) => {
    global._io.to(AdminSocketService.CONFIG.ROOM).emit(key, data);
  };

  /** Rời hết phòng player — dùng khi connect / admin join / leave */
  static leaveAllPlayerRooms = (socket) => {
    if (!socket) return;
    for (const room of GAME_PLAYER_ROOMS) {
      socket.leave(room);
    }
  };

  /**
   * Join đúng 1 phòng game. Client cũ join all rooms → chỉ còn phòng cuối.
   * Admin không vào phòng player (dùng admin_*).
   * @returns {boolean} joined
   */
  static exclusiveJoinPlayerRoom = (socket, room) => {
    if (!socket || !GAME_PLAYER_ROOMS.includes(room)) return false;
    if (isAdminSocket(socket)) {
      AdminSocketService.leaveAllPlayerRooms(socket);
      return false;
    }
    for (const r of GAME_PLAYER_ROOMS) {
      if (r !== room) socket.leave(r);
    }
    socket.join(room);
    return true;
  };

  static getGameRoomCounts = () => {
    const counts = {};
    const io = global._io;
    for (const room of GAME_PLAYER_ROOMS) {
      const set = io?.sockets?.adapter?.rooms?.get(room);
      if (!set || set.size === 0) {
        counts[room] = 0;
        continue;
      }
      // Unique user (không tính admin / socket rác)
      const seen = new Set();
      for (const sid of set) {
        const sock = io.sockets.sockets.get(sid);
        if (!sock || isAdminSocket(sock)) continue;
        const user = sock.data?.user;
        const uid = user?._id?.toString?.() || user?.taiKhoan || sid;
        seen.add(String(uid));
      }
      counts[room] = seen.size;
    }
    return counts;
  };

  static getGameBetAlerts = () => AdminSocketService.GAME_BET_ALERTS;

  static broadcastGameRoomCounts = () => {
    AdminSocketService.sendRoomAdmin({
      key: KEYS_SOCKET_ADMIN.GAME_ROOM_COUNTS,
      data: AdminSocketService.getGameRoomCounts(),
    });
  };

  static broadcastGameBetAlerts = () => {
    AdminSocketService.sendRoomAdmin({
      key: KEYS_SOCKET_ADMIN.GAME_BET_ALERTS,
      data: AdminSocketService.getGameBetAlerts(),
    });
  };

  static notifyGameBet = ({ room, phien }) => {
    if (!room || phien == null || phien === "") return;
    const phienKey = String(phien);
    const cur = AdminSocketService.GAME_BET_ALERTS[room];
    if (!cur || String(cur.phien) !== phienKey) {
      AdminSocketService.GAME_BET_ALERTS[room] = { phien: phienKey, count: 1 };
    } else {
      cur.count += 1;
    }
    AdminSocketService.broadcastGameBetAlerts();
  };

  static resetGameBetAlert = ({ room, phien }) => {
    if (!room) return;
    const phienKey = phien == null || phien === "" ? "" : String(phien);
    const cur = AdminSocketService.GAME_BET_ALERTS[room];
    // Cùng phiên → bỏ qua (XSMB interval gọi batDauGame liên tục)
    if (cur && String(cur.phien) === phienKey) return;
    AdminSocketService.GAME_BET_ALERTS[room] = { phien: phienKey, count: 0 };
    AdminSocketService.broadcastGameBetAlerts();
  };

  static ensureRoomCountBroadcast = () => {
    if (AdminSocketService._roomCountTimer) return;
    AdminSocketService._roomCountTimer = setInterval(() => {
      const room = global._io?.sockets?.adapter?.rooms?.get(AdminSocketService.CONFIG.ROOM);
      if (!room || room.size === 0) return;
      AdminSocketService.broadcastGameRoomCounts();
    }, 10000);
  };

  static notifyNewRequest = (payload) => {
    AdminSocketService.sendRoomAdmin({
      key: KEYS_SOCKET_ADMIN.NEW_REQUEST,
      data: payload,
    });
  };

  constructor(socket) {
    this.socket = socket;
    this.socket.on(KEYS_SOCKET_ADMIN.JOIN_ROOM_ADMIN, () => {
      if (!isAdminSocket(this.socket)) {
        return;
      }
      AdminSocketService.leaveAllPlayerRooms(this.socket);
      this.socket.join(AdminSocketService.CONFIG.ROOM);

      AdminSocketService.sendRoomAdmin({
        key: KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE,
        data: Object.keys(AdminSocketService.LIST_USERS_SOCKET),
      });
      this.socket.emit(KEYS_SOCKET_ADMIN.GAME_ROOM_COUNTS, AdminSocketService.getGameRoomCounts());
      this.socket.emit(KEYS_SOCKET_ADMIN.GAME_BET_ALERTS, AdminSocketService.getGameBetAlerts());
      AdminSocketService.ensureRoomCountBroadcast();
      AdminSocketService.broadcastGameRoomCounts();
    });

    this.socket.on(KEYS_SOCKET_ADMIN.GET_GAME_ROOM_COUNTS, () => {
      if (!isAdminSocket(this.socket)) return;
      this.socket.emit(KEYS_SOCKET_ADMIN.GAME_ROOM_COUNTS, AdminSocketService.getGameRoomCounts());
    });

    this.socket.on(KEYS_SOCKET_ADMIN.GET_GAME_BET_ALERTS, () => {
      if (!isAdminSocket(this.socket)) return;
      this.socket.emit(KEYS_SOCKET_ADMIN.GAME_BET_ALERTS, AdminSocketService.getGameBetAlerts());
    });
  }
}

module.exports = AdminSocketService;
