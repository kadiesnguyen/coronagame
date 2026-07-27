export const TINH_TRANG_GAME = {
  DANG_CHO: "dangCho",
  DANG_QUAY: "dangQuay",
  DANG_TRA_THUONG: "dangTraThuong",
  HOAN_TAT: "hoanTat",
};

export const STATUS_BET_GAME = {
  DANG_CHO: "dangCho",
  THANG: "thang",
  THUA: "thua",
};

export const MUC_TIEN_CUOC = [5000, 10000, 50000, 100000, 500000, 1000000];
// 2x2 như Keno: Tài | Xỉu / Lẻ | Chẵn — multi cược
export const LOAI_CUOC = [
  { tenCuoc: "Tài", chiTietCuoc: "T", loaiCuoc: "CLTX" },
  { tenCuoc: "Xỉu", chiTietCuoc: "X", loaiCuoc: "CLTX" },
  { tenCuoc: "Lẻ", chiTietCuoc: "L", loaiCuoc: "CLTX" },
  { tenCuoc: "Chẵn", chiTietCuoc: "C", loaiCuoc: "CLTX" },
];
export const GAME_HISTORY_PAGE_SIZE = 20;
export const USER_BET_GAME_HISTORY_PAGE_SIZE = 20;
