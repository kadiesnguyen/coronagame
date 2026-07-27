const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.keno");

const gameKeno5PSchema = new mongoose.Schema(
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
    collection: "GameKeno5P",
    timestamps: true,
  }
);

const GameKeno5P = mongoose.models.GameKeno5P || mongoose.model("GameKeno5P", gameKeno5PSchema);
module.exports = GameKeno5P;
