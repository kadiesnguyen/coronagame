const checkMaDonHang = (maDonHang) => {
  return maDonHang.startsWith("NAPTIEN_");
};
const getTaiKhoan = (maDonHang) => {
  let arr = maDonHang.split("_");
  if (arr.length >= 2) {
    arr.shift();
  }
  let result = arr.join("_");
  return result;
};
module.exports = {
  checkMaDonHang,
  getTaiKhoan,
};
