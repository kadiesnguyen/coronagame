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
  CHAN_LE: "chan_le",
  TUY_CHON: "tuy_chon",
};
const CHI_TIET_CUOC_GAME = {
  CHAN: "chan",
  LE: "le",
  FULL_TRANG: "full_trang",
  FULL_DO: "full_do",
  HAI_TRANG_HAI_DO: "hai_trang_hai_do",
  BA_TRANG_MOT_DO: "ba_trang_mot_do",
  BA_DO_MOT_TRANG: "ba_do_mot_trang",
};

const DEFAULT_SETTING_GAME = {
  BET_PAYOUT_PERCENT: 1.98,
  FULL_BET_PAYOUT_PERCENT: 12,
  BA_MOT_BET_PAYOUT_PERCENT: 3.5,
  HAI_HAI_BET_PAYOUT_PERCENT: 3.5,
  STATUS_AUTO_GAME: true,
};

Object.freeze(LOAI_CUOC_GAME);
Object.freeze(CHI_TIET_CUOC_GAME);
Object.freeze(DEFAULT_SETTING_GAME);
Object.freeze(STATUS_GAME);
Object.freeze(STATUS_HISTORY_GAME);
Object.freeze(STATUS_BET_GAME);
module.exports = {
  CHI_TIET_CUOC_GAME,
  DEFAULT_SETTING_GAME,
  MIN_BET_MONEY,
  STATUS_GAME,
  STATUS_HISTORY_GAME,
  STATUS_BET_GAME,
  MIN_RANGE_NUMBER,
  MAX_RANGE_NUMBER,
  LOAI_CUOC_GAME,
};
