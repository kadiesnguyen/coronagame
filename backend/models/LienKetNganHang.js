const mongoose = require("mongoose");

const lienKetNganHangSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    tenNganHang: {
      type: String,
      trim: true,
      required: [true, "Vui lòng nhập tên ngân hàng"],
    },
    bankCode: {
      type: String,
    },
    tenChuTaiKhoan: {
      type: String,
      trim: true,
      required: [true, "Vui lòng nhập tên chủ tài khoản"],
    },
    soTaiKhoan: {
      type: String,
      trim: true,
      required: [true, "Vui lòng nhập tên số tài khoản"],
    },
  },
  {
    collection: "LienKetNganHang",
    timestamps: true,
  }
);

const LienKetNganHang = mongoose.models.LienKetNganHang || mongoose.model("LienKetNganHang", lienKetNganHangSchema);
module.exports = LienKetNganHang;
