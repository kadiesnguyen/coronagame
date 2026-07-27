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
}

module.exports = UserSocketService;
