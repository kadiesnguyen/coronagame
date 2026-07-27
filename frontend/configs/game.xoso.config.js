export const TINH_TRANG_GAME = {
  DANG_CHO: "dangCho",
  CHUAN_BI_QUAY: "chuanBiQuay",
  DANG_QUAY: "dangQuay",
  DANG_TRA_THUONG: "dangTraThuong",
  HOAN_TAT: "hoanTat",
};
export const STATUS_BET_GAME = {
  DANG_CHO: "dangCho",
  THANG: "thang",
  THUA: "thua",
};

export const LOAI_CUOC_GAME = {
  LO: "lo",
  DE: "de",
  BA_CANG: "ba_cang",
  LO_XIEN_2: "lo_xien_2",
  LO_XIEN_3: "lo_xien_3",
  LO_XIEN_4: "lo_xien_4",
};

export const DEFAULT_SETTING_GAME = {
  LO_BET_PAYOUT_PERCENT: 99,
  DE_BET_PAYOUT_PERCENT: 99,
  BA_CANG_BET_PAYOUT_PERCENT: 835,
  LO_XIEN_2_BET_PAYOUT_PERCENT: 8,
  LO_XIEN_3_BET_PAYOUT_PERCENT: 40,
  LO_XIEN_4_BET_PAYOUT_PERCENT: 40,
};

export const convertLoaiCuoc = (loaiCuoc) => {
  switch (loaiCuoc) {
    case LOAI_CUOC_GAME.LO:
      return "Lô";
    case LOAI_CUOC_GAME.DE:
      return "Đề";
    case LOAI_CUOC_GAME.BA_CANG:
      return "Ba càng";
    case LOAI_CUOC_GAME.LO_XIEN_2:
      return "Lô xiên 2";
    case LOAI_CUOC_GAME.LO_XIEN_3:
      return "Lô xiên 3";
    case LOAI_CUOC_GAME.LO_XIEN_4:
      return "Lô xiên 4";
    default:
      return "";
  }
};
export const convertKeyTiLe = (loaiCuoc) => {
  switch (loaiCuoc) {
    case LOAI_CUOC_GAME.LO:
      return "tiLeLo";
    case LOAI_CUOC_GAME.DE:
      return "tiLeDe";
    case LOAI_CUOC_GAME.BA_CANG:
      return "tiLeBaCang";
    case LOAI_CUOC_GAME.LO_XIEN_2:
      return "tiLeLoXien2";
    case LOAI_CUOC_GAME.LO_XIEN_3:
      return "tiLeLoXien3";
    case LOAI_CUOC_GAME.LO_XIEN_4:
      return "tiLeLoXien4";
    default:
      return "";
  }
};
export const getTiLeDefault = (loaiCuoc) => {
  switch (loaiCuoc) {
    case LOAI_CUOC_GAME.LO:
      return DEFAULT_SETTING_GAME.LO_BET_PAYOUT_PERCENT;
    case LOAI_CUOC_GAME.DE:
      return DEFAULT_SETTING_GAME.DE_BET_PAYOUT_PERCENT;
    case LOAI_CUOC_GAME.BA_CANG:
      return DEFAULT_SETTING_GAME.BA_CANG_BET_PAYOUT_PERCENT;
    case LOAI_CUOC_GAME.LO_XIEN_2:
      return DEFAULT_SETTING_GAME.LO_XIEN_2_BET_PAYOUT_PERCENT;
    case LOAI_CUOC_GAME.LO_XIEN_3:
      return DEFAULT_SETTING_GAME.LO_XIEN_3_BET_PAYOUT_PERCENT;
    case LOAI_CUOC_GAME.LO_XIEN_4:
      return DEFAULT_SETTING_GAME.LO_XIEN_4_BET_PAYOUT_PERCENT;
    default:
      return 0;
  }
};

export const GAME_HISTORY_PAGE_SIZE = 20;
export const USER_BET_GAME_HISTORY_PAGE_SIZE = 20;
