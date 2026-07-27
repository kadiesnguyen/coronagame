const mongoose = require("mongoose");
const { MIN_BET_MONEY, STATUS_BET_GAME, STATUS_HISTORY_GAME, LOAI_CUOC_GAME } = require("../configs/game.xoso");
const { convertMoney } = require("../utils/convertMoney");

const lichSuDatCuocXoSo5PSchema = new mongoose.Schema(
  {
    phien: {
      type: mongoose.Schema.ObjectId,
      ref: "GameXoSo5P",
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
        chiTietCuoc: [
          {
            so: { type: String, default: "" },
            tienCuoc: {
              type: Number,
              min: [MIN_BET_MONEY, `Tiền cược mỗi số tối thiểu là ${convertMoney(MIN_BET_MONEY)}`],
              default: 0,
            },
          },
        ],
        tongTienCuoc: {
          type: Number,
          min: [MIN_BET_MONEY, `Tổng tiền cược tối thiểu là ${convertMoney(MIN_BET_MONEY)}`],
          default: 0,
        },
        tongThang: {
          type: Number,

          default: 0,
        },
        trangThai: {
          type: String,
          enum: Object.values(STATUS_BET_GAME),
          default: STATUS_BET_GAME.DANG_CHO,
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
    collection: "LichSuDatCuocXoSo5P",
    timestamps: true,
  }
);

const LichSuDatCuocXoSo5P = mongoose.models.LichSuDatCuocXoSo5P || mongoose.model("LichSuDatCuocXoSo5P", lichSuDatCuocXoSo5PSchema);
module.exports = LichSuDatCuocXoSo5P;
