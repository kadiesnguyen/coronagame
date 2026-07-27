export const convertChiTietCuoc = ({ chiTietCuoc, loaiCuoc }) => {
  if (chiTietCuoc === "batky" && loaiCuoc === "2SO") {
    return "2 số bất kỳ";
  } else if (chiTietCuoc === "batky" && loaiCuoc === "3SO") {
    return "3 số bất kỳ";
  } else {
    return chiTietCuoc;
  }
};

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
