const mongoose = require("mongoose");
function getTileValue(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

const heThongSchema = new mongoose.Schema(
  {
    systemID: { type: Number, default: 1, unique: true },
    danhSachNganHang: [
      {
        shortName: { type: String },
        tenBank: { type: String },
        tenChuTaiKhoan: { type: String },
        soTaiKhoan: { type: String },
        image: { type: String },
        code: { type: String },
        status: { type: Boolean, default: true },
      },
    ],
    telegramBotConfigs: {
      idReceiveMessage: { type: String, default: "" },
      botToken: { type: String, default: "" },
      isGameNotify: { type: Boolean, default: true },
      isDepositNotify: { type: Boolean, default: true },
      isWithdrawNotify: { type: Boolean, default: true },
    },

    cskhConfigs: {
      tawk: {
        propertyId: { type: String, default: "property_id" },
        widgetId: { type: String, default: "default" },
      },
      telegram: {
        tenNguoiDung: { type: String, default: "" },
        status: { type: Boolean, default: true },
      },
    },
    gameConfigs: {
      kenoConfigs: {
        keno1P: {
          tiLeCLTX: {
            type: mongoose.Types.Decimal128,
            default: 1.98,
            get: getTileValue,
          },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
        keno3P: {
          tiLeCLTX: {
            type: mongoose.Types.Decimal128,
            default: 1.98,
            get: getTileValue,
          },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
        keno5P: {
          tiLeCLTX: {
            type: mongoose.Types.Decimal128,
            default: 1.98,
            get: getTileValue,
          },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
      },
      xucXacConfigs: {
        xucXac1P: {
          tiLeCLTX: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
        xucXac3P: {
          tiLeCLTX: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
        xucXac5P: {
          tiLeCLTX: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
      },
      xocDiaConfigs: {
        xocDia1P: {
          tiLeCL: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          tiLeBaMot: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeHaiHai: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeFull: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
      },
      xoSoConfigs: {
        xoSo3P: {
          tiLeLo: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          tiLeDe: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeBaCang: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeLoXien2: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          tiLeLoXien3: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          tiLeLoXien4: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
        xoSo5P: {
          tiLeLo: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          tiLeDe: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeBaCang: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeLoXien2: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          tiLeLoXien3: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          tiLeLoXien4: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
        xoSoMB: {
          tiLeLo: { type: mongoose.Types.Decimal128, default: 1.98, get: getTileValue },
          tiLeDe: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeBaCang: { type: mongoose.Types.Decimal128, default: 3.5, get: getTileValue },
          tiLeLoXien2: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          tiLeLoXien3: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          tiLeLoXien4: { type: mongoose.Types.Decimal128, default: 12, get: getTileValue },
          autoGame: {
            type: Boolean,
            default: true,
          },
        },
      },
    },
  },
  {
    collection: "HeThong",
    timestamps: true,
    toJSON: { getters: true },
  }
);

const HeThong = mongoose.models.HeThong || mongoose.model("HeThong", heThongSchema);
module.exports = HeThong;
