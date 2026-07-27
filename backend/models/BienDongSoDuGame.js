const mongoose = require("mongoose");
const { LOAI_GAME } = require("../configs/game.config");

const bienDongSoDuGameSchema = new mongoose.Schema(
  {
    loaiGame: {
      type: String,
      enum: Object.values(LOAI_GAME),
    },
  },
  {
    collection: "BienDongSoDuGame",
    timestamps: true,
  }
);

const BienDongSoDuGame = mongoose.models.BienDongSoDuGame || mongoose.model("BienDongSoDuGame", bienDongSoDuGameSchema);
module.exports = BienDongSoDuGame;
