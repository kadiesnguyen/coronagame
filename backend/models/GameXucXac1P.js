const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.xucxac");

const gameXucXac1PSchema = new mongoose.Schema(
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
    collection: "GameXucXac1P",
    timestamps: true,
  }
);

const GameXucXac1P = mongoose.models.GameXucXac1P || mongoose.model("GameXucXac1P", gameXucXac1PSchema);
module.exports = GameXucXac1P;
