const { MIN_RANGE_NUMBER, MAX_RANGE_NUMBER } = require("../../configs/game.xucxac");
const getRandomArbitrary = require("../randomRangeNumber");

const getKetQua = (ketQua) => {
  const results = {
    T: false,
    X: false,
    C: false,
    L: false,
  };
  const tongXucXac = ketQua.reduce((a, b) => a + b, 0);
  if (tongXucXac < 11) {
    results.X = true;
  } else {
    results.T = true;
  }
  if (tongXucXac % 2 === 0) {
    results.C = true;
  } else {
    results.L = true;
  }
  return results;
};
const randomXucXacTheoLoai = ({ loai = "X" }) => {
  let ketQua = Array.from({ length: 3 }).map((_) => getRandomArbitrary(MIN_RANGE_NUMBER, MAX_RANGE_NUMBER));
  const tongXucXac = ketQua.reduce((a, b) => a + b, 0);
  if (loai === "X") {
    if (tongXucXac <= 10) {
      return ketQua;
    }
    return randomXucXacTheoLoai({ loai });
  }
  if (loai === "T") {
    if (tongXucXac > 10) {
      return ketQua;
    }
    return randomXucXacTheoLoai({ loai });
  }
  if (loai === "C") {
    if (tongXucXac % 2 === 0) {
      return ketQua;
    }
    return randomXucXacTheoLoai({ loai });
  }
  if (loai === "L") {
    if (tongXucXac % 2 !== 0) {
      return ketQua;
    }
    return randomXucXacTheoLoai({ loai });
  }
  return ketQua;
};
const convertChiTietCuoc = (chiTietCuoc, loaiCuoc) => {
  if (chiTietCuoc === "batky" && loaiCuoc === "2SO") {
    return "2 số bất kỳ";
  } else if (chiTietCuoc === "batky" && loaiCuoc === "3SO") {
    return "3 số bất kỳ";
  } else {
    return chiTietCuoc;
  }
};
module.exports = {
  getKetQua,
  randomXucXacTheoLoai,
  convertChiTietCuoc,
};
