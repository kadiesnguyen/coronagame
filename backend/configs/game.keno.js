const MIN_BET_MONEY = 1;
const MIN_RANGE_NUMBER = 0;
const MAX_RANGE_NUMBER = 9;
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

const DEFAULT_SETTING_GAME = {
  BET_PAYOUT_PERCENT: 1.98,
  STATUS_AUTO_GAME: true,
};

const LOAI_CUOC_GAME = {
  CHAN: "C",
  LE: "L",
};
const LOAI_BI = {
  BI_1: 1,
  BI_2: 2,
  BI_3: 3,
  BI_4: 4,
  BI_5: 5,
};

Object.freeze(DEFAULT_SETTING_GAME);
Object.freeze(STATUS_GAME);
Object.freeze(STATUS_HISTORY_GAME);
Object.freeze(STATUS_BET_GAME);
Object.freeze(LOAI_CUOC_GAME);
Object.freeze(LOAI_BI);
module.exports = {
  DEFAULT_SETTING_GAME,
  MIN_BET_MONEY,
  STATUS_GAME,
  STATUS_HISTORY_GAME,
  STATUS_BET_GAME,
  MIN_RANGE_NUMBER,
  MAX_RANGE_NUMBER,
  LOAI_CUOC_GAME,
  LOAI_BI,
};
