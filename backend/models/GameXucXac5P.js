const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.xucxac");

const gameXucXac5PSchema = new mongoose.Schema(
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
    collection: "GameXucXac5P",
    timestamps: true,
  }
);

const GameXucXac5P = mongoose.models.GameXucXac5P || mongoose.model("GameXucXac5P", gameXucXac5PSchema);
module.exports = GameXucXac5P;
