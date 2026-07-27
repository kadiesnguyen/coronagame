import bcrypt from "bcrypt";
import mongoose from "mongoose";

const nguoiDungSchema = new mongoose.Schema(
  {
    taiKhoan: {
      type: String,
      unique: true,
      trim: true,
      minlength: [6, "Tài khoản phải từ 6 kí tự trở lên"],
      required: [true, "Vui lòng nhập tài khoản"],
    },
    matKhau: {
      type: String,
      trim: true,
      minlength: [6, "Mật khẩu phải từ 6 kí tự trở lên"],
      required: [true, "Vui lòng nhập mật khẩu"],
    },
    nhapLaiMatKhau: {
      type: String,
      trim: true,
      minlength: [6, "Nhập lại mật khẩu phải từ 6 kí tự trở lên"],
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
      default: 0,
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
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
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
  next();
});

const NguoiDung = mongoose.models.NguoiDung || mongoose.model("NguoiDung", nguoiDungSchema);
export default NguoiDung;
