"use strict";

const NguoiDung = require("../models/NguoiDung");

class UserSocketService {
  constructor(socket) {
    this.socket = socket;
    this.socket.on("get-current-balance", async (account, callback) => {
      try {
        const getUser = await NguoiDung.findOne({ taiKhoan: account }).select("money").lean();
        if (!getUser) {
          throw new Error("Err");
        }
        callback({
          status: "success",
          data: getUser.money,
        });
      } catch (err) {
        console.log(err);
        callback({
          status: "error",
        });
      }
    });
  }
  static updateUserBalance = ({ user, updateBalance }) => {
    global._io.to(user).emit("update-current-balance", updateBalance);
  };

  /** Thông báo nạp/rút (và các alert cá nhân) → room = taiKhoan */
  static notifyUser = ({ taiKhoan, payload }) => {
    if (!taiKhoan || !payload?.id) return;
    global._io.to(taiKhoan).emit("user:notification", {
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    });
  };
}

module.exports = UserSocketService;
