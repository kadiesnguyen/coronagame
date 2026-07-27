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
  CHAN_LE: "chan_le",
  TUY_CHON: "tuy_chon",
};
export const CHI_TIET_CUOC_GAME = {
  CHAN: "chan",
  LE: "le",
  FULL_TRANG: "full_trang",
  FULL_DO: "full_do",
  HAI_TRANG_HAI_DO: "hai_trang_hai_do",
  BA_TRANG_MOT_DO: "ba_trang_mot_do",
  BA_DO_MOT_TRANG: "ba_do_mot_trang",
};

export const DEFAULT_SETTING_GAME = {
  BET_PAYOUT_PERCENT: 1.98,
  FULL_BET_PAYOUT_PERCENT: 12,
  BA_MOT_BET_PAYOUT_PERCENT: 3.5,
  HAI_HAI_BET_PAYOUT_PERCENT: 3.5,
  STATUS_AUTO_GAME: true,
};
export const convertChiTietCuoc = (chiTietCuoc) => {
  switch (chiTietCuoc) {
    case CHI_TIET_CUOC_GAME.CHAN:
      return "Chẵn";
    case CHI_TIET_CUOC_GAME.LE:
      return "Lẻ";
    case CHI_TIET_CUOC_GAME.FULL_TRANG:
      return "4 trắng";
    case CHI_TIET_CUOC_GAME.FULL_DO:
      return "4 đỏ";
    case CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO:
      return "2 trắng 2 đỏ";
    case CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO:
      return "3 trắng 1 đỏ";
    case CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG:
      return "3 đỏ 1 trắng";
    default:
      return "";
  }
};

export const LOAI_CUOC = [
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.CHAN),
    chiTietCuoc: CHI_TIET_CUOC_GAME.CHAN,
    loaiCuoc: LOAI_CUOC_GAME.CHAN_LE,
  },
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.LE),
    chiTietCuoc: CHI_TIET_CUOC_GAME.LE,
    loaiCuoc: LOAI_CUOC_GAME.CHAN_LE,
  },
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.FULL_TRANG),
    chiTietCuoc: CHI_TIET_CUOC_GAME.FULL_TRANG,
    loaiCuoc: LOAI_CUOC_GAME.TUY_CHON,
    ketQua: [0, 0, 0, 0],
  },
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.FULL_DO),
    chiTietCuoc: CHI_TIET_CUOC_GAME.FULL_DO,
    loaiCuoc: LOAI_CUOC_GAME.TUY_CHON,
    ketQua: [1, 1, 1, 1],
  },
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO),
    chiTietCuoc: CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO,
    loaiCuoc: LOAI_CUOC_GAME.TUY_CHON,
    ketQua: [0, 0, 1, 1],
  },
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG),
    chiTietCuoc: CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG,
    loaiCuoc: LOAI_CUOC_GAME.TUY_CHON,
    ketQua: [0, 1, 1, 1],
  },
  {
    tenCuoc: convertChiTietCuoc(CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO),
    chiTietCuoc: CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO,
    loaiCuoc: LOAI_CUOC_GAME.TUY_CHON,
    ketQua: [1, 0, 0, 0],
  },
];
export const MUC_TIEN_CUOC = [
  { amount: 5000, typeChip: 10 },
  { amount: 10000, typeChip: 25 },
  { amount: 50000, typeChip: 50 },
  { amount: 100000, typeChip: 100 },
  { amount: 500000, typeChip: 200 },
  { amount: 1000000, typeChip: 500 },
  { amount: 5000000, typeChip: 5 },
];
export const LOAI_BI = [1, 2, 3, 4];

export const TYPE_CUOC_CHAN = [
  [0, 0, 0, 0],
  [0, 0, 1, 1],
  [1, 1, 0, 0],
  [1, 1, 1, 1],
];
export const TYPE_CUOC_LE = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
  [1, 1, 1, 0],
  [0, 1, 1, 1],
];
export const GAME_HISTORY_PAGE_SIZE = 20;
export const USER_BET_GAME_HISTORY_PAGE_SIZE = 20;
