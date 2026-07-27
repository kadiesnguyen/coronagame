const MIN_BET_MONEY = 1;
const MIN_RANGE_NUMBER = 0;
const MAX_RANGE_NUMBER = 1;
const STATUS_GAME = {
  DANG_CHO: "dangCho",
  DANG_QUAY: "dangQuay",
  DANG_TRA_THUONG: "dangTraThuong",
  HOAN_TAT: "hoanTat",
};
const STATUS_HISTORY_GAME = {
  DANG_CHO: "dangCho",
  DANG_QUAY: "dangQuay",
  DANG_TRA_THUONG: "dangTraThuong",
  HOAN_TAT: "hoanTat",
};
const STATUS_BET_GAME = {
  DANG_CHO: "dangCho",
  THANG: "thang",
  THUA: "thua",
};
const LOAI_CUOC_GAME = {
  LO: "lo",
  DE: "de",
  BA_CANG: "ba_cang",
  LO_XIEN_2: "lo_xien_2",
  LO_XIEN_3: "lo_xien_3",
  LO_XIEN_4: "lo_xien_4",
};

const DEFAULT_SETTING_GAME = {
  LO_BET_PAYOUT_PERCENT: 99,
  DE_BET_PAYOUT_PERCENT: 99,
  BA_CANG_BET_PAYOUT_PERCENT: 835,
  LO_XIEN_2_BET_PAYOUT_PERCENT: 8,
  LO_XIEN_3_BET_PAYOUT_PERCENT: 40,
  LO_XIEN_4_BET_PAYOUT_PERCENT: 40,

  STATUS_AUTO_GAME: true,
};

Object.freeze(LOAI_CUOC_GAME);

Object.freeze(DEFAULT_SETTING_GAME);
Object.freeze(STATUS_GAME);
Object.freeze(STATUS_HISTORY_GAME);
Object.freeze(STATUS_BET_GAME);
module.exports = {
  DEFAULT_SETTING_GAME,
  MIN_BET_MONEY,
  STATUS_GAME,
  STATUS_HISTORY_GAME,
  STATUS_BET_GAME,
  MIN_RANGE_NUMBER,
  MAX_RANGE_NUMBER,
  LOAI_CUOC_GAME,
};
