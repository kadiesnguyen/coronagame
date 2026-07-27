const LOAI_DEPOSIT = {
  NAP_TIEN: "naptien",
  NHAN_TIEN: "nhantien",
  TRU_TIEN: "trutien",
};
const STATUS_DEPOSIT = {
  PENDING: "dangCho",
  SUCCESS: "hoanTat",
  CANCEL: "daHuy",
};
const MIN_MONEY_DEPOSIT = 10000;

Object.freeze(LOAI_DEPOSIT);
Object.freeze(STATUS_DEPOSIT);
module.exports = {
  LOAI_DEPOSIT,
  STATUS_DEPOSIT,
  MIN_MONEY_DEPOSIT,
};
