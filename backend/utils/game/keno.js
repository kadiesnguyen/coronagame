const { MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../../configs/game.keno");
const getRandomArbitrary = require("../randomRangeNumber");

const randomBiTheoLoai = ({ loai = "C" }) => {
  let ketQua = getRandomArbitrary(MIN_RANGE_NUMBER, MAX_RANGE_NUMBER);
  if (loai === "C") {
    if (ketQua % 2 === 0) {
      return ketQua;
    }
    return randomBiTheoLoai({ loai });
  }
  if (loai === "L") {
    if (ketQua % 2 !== 0) {
      return ketQua;
    }
    return randomBiTheoLoai({ loai });
  }
  if (loai === "T") {
    // Tài: 5-9
    if (ketQua >= 5) {
      return ketQua;
    }
    return randomBiTheoLoai({ loai });
  }
  if (loai === "X") {
    // Xỉu: 0-4
    if (ketQua <= 4) {
      return ketQua;
    }
    return randomBiTheoLoai({ loai });
  }
  return ketQua;
};

/**
 *
 * @param {Array<Number>} ketQua Kết quả xổ số: [0,0,0,0,0]
 */
const getKetQua = (ketQua) => {
  const results = {
    1: { C: false, L: false, T: false, X: false },
    2: { C: false, L: false, T: false, X: false },
    3: { C: false, L: false, T: false, X: false },
    4: { C: false, L: false, T: false, X: false },
    5: { C: false, L: false, T: false, X: false },
  };
  for (let i = 0; i < ketQua.length; i++) {
    const key = `${i + 1}`;
    const value = Number(ketQua[i]);
    const isChan = value % 2 === 0;
    const isTai = value >= 5;
    results[key].C = isChan;
    results[key].L = !isChan;
    results[key].T = isTai;
    results[key].X = !isTai;
  }
  return results;
};

module.exports = {
  getKetQua,
  randomBiTheoLoai,
};
