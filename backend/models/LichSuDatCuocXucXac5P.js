const mongoose = require("mongoose");
const { MIN_BET_MONEY, STATUS_BET_GAME, STATUS_HISTORY_GAME, LOAI_CUOC_GAME, CHI_TIET_CUOC_GAME } = require("../configs/game.xucxac");
const { convertMoney } = require("../utils/convertMoney");
const lichSuDatCuocXucXac5PSchema = new mongoose.Schema(
  {
    phien: {
      type: mongoose.Schema.ObjectId,
      ref: "GameXucXac5P",
    },
    nguoiDung: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    datCuoc: [
      {
        loaiCuoc: {
          type: String,
          enum: { values: Object.values(LOAI_CUOC_GAME), message: "Loại cược không hợp lệ" },
        },
        chiTietCuoc: {
          type: String,
          enum: { values: Object.values(CHI_TIET_CUOC_GAME), message: "Chi tiết cược không hợp lệ" },
        },
        tienCuoc: {
          type: Number,
          min: [MIN_BET_MONEY, `Tổng tiền cược tối thiểu là ${convertMoney(MIN_BET_MONEY)}`],
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
    collection: "LichSuDatCuocXucXac5P",
    timestamps: true,
  }
);

const LichSuDatCuocXucXac5P = mongoose.models.LichSuDatCuocXucXac5P || mongoose.model("LichSuDatCuocXucXac5P", lichSuDatCuocXucXac5PSchema);
module.exports = LichSuDatCuocXucXac5P;
