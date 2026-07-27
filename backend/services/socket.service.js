"use strict";
const AdminSocketService = require("./admin.socket.service");
const GameKeno1PSocketService = require("./game.socket.service/game.keno1p.socket.service");
const GameKeno3PSocketService = require("./game.socket.service/game.keno3p.socket.service");
const GameKeno5PSocketService = require("./game.socket.service/game.keno5p.socket.service");
const GameXucXac1PSocketService = require("./game.socket.service/game.xucxac1p.socket.service");
const GameXucXac3PSocketService = require("./game.socket.service/game.xucxac3p.socket.service");
const GameXocDia1PSocketService = require("./game.socket.service/game.xocdia1p.socket.service");
const GameXoSo3PSocketService = require("./game.socket.service/game.xoso3p.socket.service");
const GameXoSo5PSocketService = require("./game.socket.service/game.xoso5p.socket.service");
const GameXoSoMBSocketService = require("./game.socket.service/game.xosomb.socket.service");
const UserSocketService = require("./user.socket.service");
const { KEYS_SOCKET_ADMIN } = require("../configs/admin.socket");
const BullMQService = require("./bullmq.service");

class SocketService {
  connection(socket) {
    if (socket.recovered) {
      console.log("SOCKET recovery", global._io.sockets.adapter.rooms);
      AdminSocketService.LIST_USERS_SOCKET[global._io.user.taiKhoan] = global._io.user;

      // Send list users online
      AdminSocketService.sendRoomAdmin({
        key: KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE,
        data: Object.keys(AdminSocketService.LIST_USERS_SOCKET),
      });
    }
    console.log("New client connected " + socket.id);
    AdminSocketService.LIST_USERS_SOCKET[global._io.user.taiKhoan] = global._io.user;

    BullMQService.initQueue({
      queueName: BullMQService.LIST_QUEUE_NAME.UPDATE_LAST_ONLINE_TIME,
    });

    // Send list users online
    AdminSocketService.sendRoomAdmin({
      key: KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE,
      data: Object.keys(AdminSocketService.LIST_USERS_SOCKET),
    });

    socket.on("disconnect", () => {
      console.log("client disconnected " + socket.id);

      console.log("ROOM AFTER DISCONNECT:", global._io.sockets.adapter.rooms);
      const checkIsExistsKey = global._io.sockets.adapter.rooms.has(global._io.user.taiKhoan);

      /**
       * Nếu tồn tại nhiều socket cùng tài khoản  thì không xóa (ví dụ nhiều tab mở cùng 1 tài khoản)
       */
      if (!checkIsExistsKey) {
        delete AdminSocketService.LIST_USERS_SOCKET[global._io.user.taiKhoan];

        /**
         * Cập nhật thời gian online cuối
         */
        (async () => {
          const getQueueUpdateLastTimeOnline = BullMQService.initQueue({
            queueName: BullMQService.LIST_QUEUE_NAME.UPDATE_LAST_ONLINE_TIME,
          });
          const nameJob = `updateLastOnlineTime-${global._io.user.taiKhoan}`;

          await getQueueUpdateLastTimeOnline.add(
            nameJob,
            {
              taiKhoan: global._io.user.taiKhoan,
              lastOnlineTime: Date.now(),
            },
            {
              removeOnComplete: true,
              removeOnFail: true,
              attempts: 5,
            }
          );
        })();
      }
      // Send list users online
      AdminSocketService.sendRoomAdmin({
        key: KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE,
        data: Object.keys(AdminSocketService.LIST_USERS_SOCKET),
      });
    });
    new GameKeno1PSocketService(socket);
    new GameKeno3PSocketService(socket);
    new GameKeno5PSocketService(socket);

    new GameXucXac1PSocketService(socket);
    new GameXucXac3PSocketService(socket);

    new GameXocDia1PSocketService(socket);
    new GameXoSo3PSocketService(socket);
    new GameXoSo5PSocketService(socket);
    new GameXoSoMBSocketService(socket);

    new UserSocketService(socket);
    new AdminSocketService(socket);
  }
}
module.exports = SocketService;
