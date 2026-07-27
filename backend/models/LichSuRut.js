const mongoose = require("mongoose");
const { STATUS_WITHDRAW } = require("../configs/withdraw.config");
const lichSuRutSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    soTien: {
      type: Number,
      default: 0,
    },
    nganHang: {
      type: mongoose.Schema.ObjectId,
      ref: "LienKetNganHang",
      trim: true,
      required: [true, "Vui lòng chọn ngân hàng cần rút"],
    },
    tinhTrang: {
      type: String,
      enum: [STATUS_WITHDRAW.PENDING, STATUS_WITHDRAW.SUCCESS, STATUS_WITHDRAW.CANCEL],
      default: STATUS_WITHDRAW.PENDING,
    },
    noiDung: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "LichSuRut",
    timestamps: true,
  }
);
const LichSuRut = mongoose.models.LichSuRut || mongoose.model("LichSuRut", lichSuRutSchema);
module.exports = LichSuRut;
