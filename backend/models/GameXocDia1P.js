const mongoose = require("mongoose");
const { STATUS_GAME, MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../configs/game.xocdia");
const gameXocDia1PSchema = new mongoose.Schema(
  {
    phien: {
      type: Number,
      unique: true,
    },
    ketQua: [
      {
        type: Number,
        min: MIN_RANGE_NUMBER, // 0: BI TRANG
        max: MAX_RANGE_NUMBER, // 1: BI DO
      },
    ],
    tinhTrang: {
      type: String,
      enum: Object.values(STATUS_GAME),
      default: STATUS_GAME.DANG_CHO,
    },
  },
  {
    collection: "GameXocDia1P",
    timestamps: true,
  }
);

const GameXocDia1P = mongoose.models.GameXocDia1P || mongoose.model("GameXocDia1P", gameXocDia1PSchema);
module.exports = GameXocDia1P;
