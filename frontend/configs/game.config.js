export const LOAI_GAME = {
  KENO1P: "keno1p",
  KENO3P: "keno3p",
  KENO5P: "keno5p",
  KENO10P: "keno10p",
  XUCXAC1P: "xucxac1p",
  XUCXAC3P: "xucxac3p",
  XOCDIA1P: "xocdia1p",
  XOSO3P: "xoso3p",
  XOSO5P: "xoso5p",
  XOSOMB: "xosomb",
};
export const convertLoaiGame = (loaiGame) => {
  switch (loaiGame) {
    case LOAI_GAME.KENO1P:
      return "Keno 1P";
    case LOAI_GAME.KENO3P:
      return "Keno 3P";
    case LOAI_GAME.KENO5P:
      return "Keno 5P";
    case LOAI_GAME.KENO10P:
      return "Keno 10P";
    case LOAI_GAME.XUCXAC1P:
      return "Xúc xắc 1p";
    case LOAI_GAME.XUCXAC3P:
      return "Xúc xắc 3p";
    case LOAI_GAME.XOCDIA1P:
      return "Xóc đĩa 1p";
    case LOAI_GAME.XOSO3P:
      return "Xổ số 3p";
    case LOAI_GAME.XOSO5P:
      return "Xổ số 5p";
    case LOAI_GAME.XOSOMB:
      return "Xổ số miền bắc";

    default:
      return "";
  }
};
