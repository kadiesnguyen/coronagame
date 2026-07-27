const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.keno");
const gameKeno1PSchema = new mongoose.Schema(
  {
    phien: {
      type: Number,
      unique: true,
    },
    ketQua: [
      {
        type: Number,
        min: MIN_RANGE_NUMBER,
        max: MAX_RANGE_NUMBER,
      },
    ],
    tinhTrang: {
      type: String,
      enum: Object.values(STATUS_GAME),
      default: STATUS_GAME.DANG_CHO,
    },
  },
  {
    collection: "GameKeno1P",
    timestamps: true,
  }
);

const GameKeno1P = mongoose.models.GameKeno1P || mongoose.model("GameKeno1P", gameKeno1PSchema);
module.exports = GameKeno1P;
