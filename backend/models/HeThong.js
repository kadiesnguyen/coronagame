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
        link: { type: String, default: "" },
        propertyId: { type: String, default: "" },
        widgetId: { type: String, default: "" },
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
        keno10P: {
          tiLeCLTX: {
            type: mongoose.Types.Decimal128,
            default: 2.1,
            get: getTileValue,
          },
          tiLeVip: {
            vip1: {
              type: mongoose.Types.Decimal128,
              default: 2.1,
              get: getTileValue,
            },
            vip2: {
              type: mongoose.Types.Decimal128,
              default: 2.2,
              get: getTileValue,
            },
            vip3: {
              type: mongoose.Types.Decimal128,
              default: 2.3,
              get: getTileValue,
            },
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
        xucXac10P: {
          tiLeCLTX: { type: mongoose.Types.Decimal128, default: 2.1, get: getTileValue },
          tiLeVip: {
            vip1: { type: mongoose.Types.Decimal128, default: 2.1, get: getTileValue },
            vip2: { type: mongoose.Types.Decimal128, default: 2.2, get: getTileValue },
            vip3: { type: mongoose.Types.Decimal128, default: 2.3, get: getTileValue },
          },
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
    vipLevels: {
      vip1: {
        minMoney: { type: Number, default: 0 },
        maxMoney: { type: Number, default: 100000000 },
      },
      vip2: {
        minMoney: { type: Number, default: 100000000 },
        maxMoney: { type: Number, default: 1000000000 },
      },
      vip3: {
        minMoney: { type: Number, default: 1000000000 },
        maxMoney: { type: Number, default: null },
      },
    },
    branding: {
      logoUrl: { type: String, default: "" },
      banners: [
        {
          url: { type: String, required: true },
          desc: { type: String, default: "" },
          status: { type: Boolean, default: true },
        },
      ],
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
