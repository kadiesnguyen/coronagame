const mongoose = require("mongoose");
const bienDongSoDuWithdrawSchema = new mongoose.Schema(
  {
    nganHang: {
      type: String,
      default: "",
    },
  },
  {
    collection: "BienDongSoDuWithdraw",
    timestamps: true,
  }
);
const BienDongSoDuWithdraw = mongoose.models.BienDongSoDuWithdraw || mongoose.model("BienDongSoDuWithdraw", bienDongSoDuWithdrawSchema);
module.exports = BienDongSoDuWithdraw;
