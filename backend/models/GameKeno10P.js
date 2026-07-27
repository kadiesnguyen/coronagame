const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.keno");

const gameKeno10PSchema = new mongoose.Schema(
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
    collection: "GameKeno10P",
    timestamps: true,
  }
);

const GameKeno10P = mongoose.models.GameKeno10P || mongoose.model("GameKeno10P", gameKeno10PSchema);
module.exports = GameKeno10P;
