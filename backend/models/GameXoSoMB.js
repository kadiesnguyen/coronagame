const mongoose = require("mongoose");
const { STATUS_GAME } = require("../configs/game.xoso");
const gameXoSoMBSchema = new mongoose.Schema(
  {
    ngay: {
      type: String,
      unique: true,
    },
    openTime: {
      type: String,
    },

    ketQua: [
      {
        type: { type: String, default: "DB" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "1" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "2" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "3" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "4" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "5" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "6" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
      {
        type: { type: String, default: "7" },
        data: [
          {
            type: String,
            default: "",
          },
        ],
      },
    ],
    tinhTrang: {
      type: String,
      enum: Object.values(STATUS_GAME),
      default: STATUS_GAME.DANG_CHO,
    },
  },
  {
    collection: "GameXoSoMB",
    timestamps: true,
    versionKey: false,
  }
);

const GameXoSoMB = mongoose.models.GameXoSoMB || mongoose.model("GameXoSoMB", gameXoSoMBSchema);
module.exports = GameXoSoMB;
