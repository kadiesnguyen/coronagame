const mongoose = require("mongoose");
const { MIN_BET_MONEY, STATUS_BET_GAME, STATUS_HISTORY_GAME, LOAI_BI, LOAI_CUOC_GAME } = require("../configs/game.keno");
const { convertMoney } = require("../utils/convertMoney");

const lichSuDatCuocKeno5PSchema = new mongoose.Schema(
  {
    phien: {
      type: mongoose.Schema.ObjectId,
      ref: "GameKeno5P",
    },
    nguoiDung: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    datCuoc: [
      {
        loaiBi: { type: Number, enum: { values: Object.values(LOAI_BI), message: "Bi cược không hợp lệ" } },
        loaiCuoc: {
          type: String,
          enum: { values: Object.values(LOAI_CUOC_GAME), message: "Loại cược không hợp lệ" },
        },
        tienCuoc: {
          type: Number,
          min: [MIN_BET_MONEY, `Tiền cược tối thiểu là ${convertMoney(MIN_BET_MONEY)}`],
          default: 0,
        },
        trangThai: {
          type: String,
          enum: Object.values(STATUS_BET_GAME),
          default: STATUS_BET_GAME.DANG_CHO,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    tinhTrang: {
      type: String,
      enum: Object.values(STATUS_HISTORY_GAME),
      default: STATUS_HISTORY_GAME.DANG_CHO,
    },
  },
  {
    collection: "LichSuDatCuocKeno5P",
    timestamps: true,
  }
);

const LichSuDatCuocKeno5P = mongoose.models.LichSuDatCuocKeno5P || mongoose.model("LichSuDatCuocKeno5P", lichSuDatCuocKeno5PSchema);
module.exports = LichSuDatCuocKeno5P;
