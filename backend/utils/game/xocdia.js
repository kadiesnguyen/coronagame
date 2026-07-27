const { MIN_RANGE_NUMBER, MAX_RANGE_NUMBER, CHI_TIET_CUOC_GAME } = require("../../configs/game.xocdia");
const getRandomArbitrary = require("../randomRangeNumber");

/**
 *
 * @returns {Array<Number>}
 */
const randomBiTheoLoai = ({ loai = "C" }) => {
  let ketQua = Array.from({ length: 4 }).map((_) => getRandomArbitrary(MIN_RANGE_NUMBER, MAX_RANGE_NUMBER));
  const sumKetQua = ketQua.reduce((pre, cur) => pre + cur, 0);

  if (loai === "C") {
    if (sumKetQua % 2 === 0) {
      return ketQua;
    }
    return randomBiTheoLoai({ loai });
  } else if (loai === "L") {
    if (sumKetQua % 2 !== 0) {
      return ketQua;
    }
    return randomBiTheoLoai({ loai });
  } else {
    return ketQua;
  }
};

/**
 *
 * @param {Array<Number>} ketQua Kết quả xổ số: [0,0,0,0]
 * @return  Bảng tra kết quả
 */
const getKetQua = (ketQua = [0, 0, 0, 0]) => {
  const results = {
    [CHI_TIET_CUOC_GAME.CHAN]: false,
    [CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO]: false,
    [CHI_TIET_CUOC_GAME.FULL_DO]: false,
    [CHI_TIET_CUOC_GAME.FULL_TRANG]: false,
    [CHI_TIET_CUOC_GAME.LE]: false,
    [CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG]: false,
    [CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO]: false,
  };
  const sumKetQua = ketQua.reduce((pre, cur) => pre + cur, 0);
  const countBiTrang = countIfArray(ketQua, 0);
  const countBiDo = ketQua.length - countBiTrang;
  if (sumKetQua % 2 === 0) {
    results[CHI_TIET_CUOC_GAME.CHAN] = true;
    if (countBiTrang === ketQua.length) {
      results[CHI_TIET_CUOC_GAME.FULL_TRANG] = true;
    } else if (countBiDo === ketQua.length) {
      results[CHI_TIET_CUOC_GAME.FULL_DO] = true;
    } else if (countBiTrang === countBiDo) {
      results[CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO] = true;
    }
  } else {
    results[CHI_TIET_CUOC_GAME.LE] = true;
    if (countBiTrang > countBiDo) {
      results[CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO] = true;
    } else {
      results[CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG] = true;
    }
  }

  return results;
};

const countIfArray = (array = [], value) => {
  return array.filter((item) => item === value).length;
};

const convertChiTietCuoc = (chiTietCuoc) => {
  switch (chiTietCuoc) {
    case CHI_TIET_CUOC_GAME.CHAN:
      return "Chẵn";
    case CHI_TIET_CUOC_GAME.LE:
      return "Lẻ";
    case CHI_TIET_CUOC_GAME.FULL_TRANG:
      return "Toàn trắng";
    case CHI_TIET_CUOC_GAME.FULL_DO:
      return "Toàn đỏ";
    case CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO:
      return "Hai trắng hai đỏ";
    case CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO:
      return "Ba trắng một đỏ";
    case CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG:
      return "Ba đỏ một trắng";
    default:
      return "";
  }
};

module.exports = {
  getKetQua,
  randomBiTheoLoai,
  convertChiTietCuoc,
};
