const mongoose = require("mongoose");
const { STATUS_GAME } = require("../configs/game.xoso");
const gameXoSo5PSchema = new mongoose.Schema(
  {
    phien: {
      type: Number,
      unique: true,
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
        type: { type: String, default: "5" },
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
    collection: "GameXoSo5P",
    timestamps: true,
  }
);

const GameXoSo5P = mongoose.models.GameXoSo5P || mongoose.model("GameXoSo5P", gameXoSo5PSchema);
module.exports = GameXoSo5P;
