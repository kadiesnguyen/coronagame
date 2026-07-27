const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.xucxac");

const gameXucXac10PSchema = new mongoose.Schema(
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
    collection: "GameXucXac10P",
    timestamps: true,
  }
);

const GameXucXac10P = mongoose.models.GameXucXac10P || mongoose.model("GameXucXac10P", gameXucXac10PSchema);
module.exports = GameXucXac10P;
