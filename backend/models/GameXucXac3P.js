const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.xucxac");

const gameXucXac3PSchema = new mongoose.Schema(
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
    collection: "GameXucXac3P",
    timestamps: true,
  }
);

const GameXucXac3P = mongoose.models.GameXucXac3P || mongoose.model("GameXucXac3P", gameXucXac3PSchema);
module.exports = GameXucXac3P;
