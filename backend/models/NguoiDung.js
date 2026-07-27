const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { MIN_LENGTH_ACCOUNT, MIN_LENGTH_PASSWORD, USER_ROLE, USER_STATUS } = require("../configs/user.config");

const nguoiDungSchema = new mongoose.Schema(
  {
    taiKhoan: {
      type: String,
      unique: true,
      trim: true,
      minlength: [MIN_LENGTH_ACCOUNT, `Tài khoản phải từ ${MIN_LENGTH_ACCOUNT} kí tự trở lên`],
      required: [true, "Vui lòng nhập tài khoản"],
    },
    matKhau: {
      type: String,
      trim: true,
      minlength: [MIN_LENGTH_PASSWORD, `Mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`],
      required: [true, "Vui lòng nhập mật khẩu"],
    },
    nhapLaiMatKhau: {
      type: String,
      trim: true,
      minlength: [MIN_LENGTH_PASSWORD, `Nhập lại mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`],
      required: [true, "Vui lòng nhập nhập lại mật khẩu"],
      validate: {
        validator: function (el) {
          return this.matKhau === el;
        },
        message: "Mật khẩu không trùng khớp",
      },
    },
    avatar: {
      type: String,
      default: "https://i.imgur.com/gc17EZ8.jpg",
    },
    money: {
      type: Number,
      default: 1000,
      min: [0, "Số tiền không hợp lệ"],
    },
    tienCuoc: {
      type: Number,
      default: 0,
    },
    tienThang: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: [USER_ROLE.USER, USER_ROLE.ADMIN],
      default: USER_ROLE.USER,
    },
    refreshToken: [
      {
        type: String,
      },
    ],
    refreshTokenUsed: [
      {
        type: String,
      },
    ],
    lastOnlineTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
    lockTimestamp: {
      type: Date,
    },
  },
  {
    collection: "NguoiDung",
    timestamps: true,
  }
);
nguoiDungSchema.pre("save", async function (next) {
  this.matKhau = await bcrypt.hash(this.matKhau, 12);
  this.nhapLaiMatKhau = undefined;

  this.money = this.money < 0 ? 0 : this.money;
  this.tienCuoc = this.tienCuoc < 0 ? 0 : this.tienCuoc;
  this.tienThang = this.tienThang < 0 ? 0 : this.tienThang;

  next();
});

class NguoiDungClass {
  /**
   * Update mật khẩu
   * @param {*} newPassword mật khẩu mới do ng dùng nhập
   * @param {*} taiKhoan tài khoản ng dùng
   */
  static async findByTaiKhoanAndUpdatePassword({ newPassword, taiKhoan }) {
    const hashNewPassword = await bcrypt.hash(newPassword, 12);
    // Update user
    await this.findOneAndUpdate(
      {
        taiKhoan,
      },
      {
        refreshToken: [], // Reset refresh token
        matKhau: hashNewPassword,
      }
    );
  }
}

nguoiDungSchema.loadClass(NguoiDungClass);

nguoiDungSchema.index({ isProcessing: 1 });

const NguoiDung = mongoose.models.NguoiDung || mongoose.model("NguoiDung", nguoiDungSchema);

module.exports = NguoiDung;
