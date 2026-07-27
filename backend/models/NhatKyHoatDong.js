const mongoose = require("mongoose");
const dayjs = require("dayjs");
const { TYPE_ACTIVITY } = require("../configs/activity.config");
const nhatKyHoatDongSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    nguoiDungId: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    taiKhoan: {
      type: String,
    },
    count: {
      type: Number,
    },
    history: [
      {
        type: {
          type: String,
          enum: {
            values: Object.values(TYPE_ACTIVITY),
            message: "Loại hoạt động không hợp lệ",
          },
        },
        action: {
          type: String,
        },
        description: {
          type: String,
        },
        metadata: {
          type: Object,
        },
        userAgent: {
          type: Object,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    collection: "NhatKyHoatDong",
    timestamps: true,
  }
);

class NhatKyHoatDongClass {
  static async insertNhatKyHoatDong({
    taiKhoan,
    userId,
    typeActivity,
    actionActivity,
    description,
    userAgent = {},
    metadata = {},
    options = {},
  }) {
    const getCurrentTimeStamp = dayjs().valueOf();
    await this.findOneAndUpdate(
      { id: new RegExp(`^${taiKhoan}_`), count: { $lt: 10 } },
      {
        $push: {
          history: {
            type: typeActivity,
            action: actionActivity,
            description,
            metadata,
            userAgent: {
              ...userAgent,
              browser: global._USER_AGENT?.browser,
              version: global._USER_AGENT?.version,
              os: global._USER_AGENT?.os,
              source: global._USER_AGENT?.source,
            },
          },
        },
        $inc: { count: 1 },
        $setOnInsert: { id: `${taiKhoan}_${Math.floor(getCurrentTimeStamp / 1000)}`, nguoiDungId: userId, taiKhoan: taiKhoan },
      },
      { upsert: true, ...options }
    );
  }
}
nhatKyHoatDongSchema.loadClass(NhatKyHoatDongClass);

const NhatKyHoatDong = mongoose.models.NhatKyHoatDong || mongoose.model("NhatKyHoatDong", nhatKyHoatDongSchema);
module.exports = NhatKyHoatDong;
