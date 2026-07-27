const mongoose = require("mongoose");

const thongBaoSchema = new mongoose.Schema(
  {
    hinhAnh: {
      type: String,
      trim: true,
      default: "https://i.imgur.com/ZYoU3IH.png",
    },
    tieuDe: {
      type: String,
      trim: true,
    },
    noiDung: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "ThongBao",
    timestamps: true,
  }
);

const ThongBao = mongoose.models.ThongBao || mongoose.model("ThongBao", thongBaoSchema);
module.exports = ThongBao;
