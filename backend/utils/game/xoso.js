const { MIN_RANGE_NUMBER, MAX_RANGE_NUMBER, CHI_TIET_CUOC_GAME, LOAI_CUOC_GAME, DEFAULT_SETTING_GAME } = require("../../configs/game.xoso");

/**
 * Random chuỗi kí tự số theo độ dài
 */
const generateRandomNumberString = (length = 5) => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
/**
 * Lấy tỉ lệ mặc định theo loại cược
 */
const getTiLeDefault = (loaiCuoc) => {
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

/**
 * Lấy key tỉ lệ database theo loại cược

 */

const convertKeyTiLe = (loaiCuoc) => {
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

/**
 *
 * @return  Bảng tra kết quả
 */
const getKetQua = (ketQua = []) => {
  const results = {
    [LOAI_CUOC_GAME.LO]: [],
    [LOAI_CUOC_GAME.DE]: [],
    [LOAI_CUOC_GAME.BA_CANG]: [],
  };

  // Check kết quả
  ketQua.forEach(({ type, data }) => {
    data.forEach((ketQua) => {
      const getLast2Words = ketQua.slice(-2);
      // Kết quả đề
      if (type === "DB") {
        const getLast3Words = ketQua.slice(-3);
        results[LOAI_CUOC_GAME.DE].push(getLast2Words);
        results[LOAI_CUOC_GAME.BA_CANG].push(getLast3Words);
      }
      //  Kết quả lô
      results[LOAI_CUOC_GAME.LO].push(getLast2Words);
    });
  });

  return results;
};

/**
 * Lấy tên loại cược theo loại cược
 */
const convertLoaiCuoc = (loaiCuoc) => {
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

module.exports = {
  getKetQua,
  generateRandomNumberString,
  convertLoaiCuoc,
  getTiLeDefault,
  convertKeyTiLe,
};
