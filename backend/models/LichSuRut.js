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
    // Snapshot { tenNganHang, tenChuTaiKhoan, soTaiKhoan, bankCode }. Mixed để đọc được lệnh cũ (ObjectId).
    nganHang: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Vui lòng nhập thông tin ngân hàng nhận tiền"],
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
if (mongoose.models.LichSuRut) {
  delete mongoose.models.LichSuRut;
}
const LichSuRut = mongoose.model("LichSuRut", lichSuRutSchema);
module.exports = LichSuRut;
