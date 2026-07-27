const CHI_TIET_LABEL = {
  T: "Tài",
  X: "Xỉu",
  C: "Chẵn",
  L: "Lẻ",
};

export const convertChiTietCuoc = ({ chiTietCuoc, loaiCuoc }) => {
  if (chiTietCuoc === "batky" && loaiCuoc === "2SO") {
    return "2 số bất kỳ";
  }
  if (chiTietCuoc === "batky" && loaiCuoc === "3SO") {
    return "3 số bất kỳ";
  }
  return CHI_TIET_LABEL[chiTietCuoc] || chiTietCuoc;
};

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
