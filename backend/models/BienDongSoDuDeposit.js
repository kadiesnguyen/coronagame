const mongoose = require("mongoose");
const { LOAI_DEPOSIT } = require("../configs/deposit.config");

const bienDongSoDuDepositSchema = new mongoose.Schema(
  {
    loaiDeposit: {
      type: String,
      enum: Object.values(LOAI_DEPOSIT),
    },
  },
  {
    collection: "BienDongSoDuDeposit",
    timestamps: true,
  }
);

const BienDongSoDuDeposit = mongoose.models.BienDongSoDuDeposit || mongoose.model("BienDongSoDuDeposit", bienDongSoDuDepositSchema);
module.exports = BienDongSoDuDeposit;
