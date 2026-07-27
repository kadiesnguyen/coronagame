import { TINH_TRANG_GAME } from "@/configs/game.xucxac.config";
import { getRandomArbitrary } from "@/utils/xucxac";
import React, { useEffect, useRef, useState } from "react";

const BoxQuay = ({ tinhTrang, ketQuaRandom, phienHoanTatMoiNhat }) => {
  const rollDiceTimeIntervalRef = useRef();

  const [ketQua, setKetQua] = useState(
    phienHoanTatMoiNhat?.ketQua?.[0]?.data?.[0]?.split("")?.map((item) => Number(item)) ?? [0, 0, 0, 0, 0]
  ); // kết quả thực sự
  const [ketQuaQuay, setKetQuaQuay] = useState([0, 0, 0, 0, 0]); // kết quả hiển thị trong khi random
  // Đồng bộ dữ liệu mới nhất
  useEffect(() => {
    if (phienHoanTatMoiNhat && phienHoanTatMoiNhat.ketQua) {
      setKetQua(phienHoanTatMoiNhat.ketQua[0].data[0].split("").map((item) => Number(item)));
    }
  }, [phienHoanTatMoiNhat]);

  // Đồng bộ dữ liệu mới nhất
  useEffect(() => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      setKetQua(ketQuaRandom[0].data[0].split("").map((item) => Number(item)));
    }
  }, [ketQuaRandom]);

  useEffect(() => {
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY) {
      rollDiceTimeIntervalRef.current = setInterval(() => {
        setKetQuaQuay(Array.from({ length: 5 }).map((_) => getRandomArbitrary(0, 9)));
      }, 100);
    }
    return () => {
      clearInterval(rollDiceTimeIntervalRef.current);
    };
  }, [tinhTrang]);

  const convertKetQua = (index) => {
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY) {
      return ketQuaQuay[index];
    }
    return ketQua[index];
  };

  return (
    <>
      <div
        className="ball_xs"
        style={{
          height: "3rem",
          alignItems: "center",
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="redball">
            {convertKetQua(i)}
          </div>
        ))}
      </div>
    </>
  );
};
export default React.memo(BoxQuay);
