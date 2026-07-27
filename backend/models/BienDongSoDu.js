const mongoose = require("mongoose");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");

const bienDongSoDuSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    tienTruoc: {
      type: Number,
      default: 0,
    },
    tienSau: {
      type: Number,
      default: 0,
    },
    noiDung: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(TYPE_BALANCE_FLUCTUATION),
      default: TYPE_BALANCE_FLUCTUATION.OTHER,
    },
    metadata: {
      type: Object,
    },
  },
  {
    collection: "BienDongSoDu",
    timestamps: true,
  }
);

const BienDongSoDu = mongoose.models.BienDongSoDu || mongoose.model("BienDongSoDu", bienDongSoDuSchema);
module.exports = BienDongSoDu;
