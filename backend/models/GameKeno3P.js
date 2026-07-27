const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.keno");

const gameKeno3PSchema = new mongoose.Schema(
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
    collection: "GameKeno3P",
    timestamps: true,
  }
);

const GameKeno3P = mongoose.models.GameKeno3P || mongoose.model("GameKeno3P", gameKeno3PSchema);
module.exports = GameKeno3P;
