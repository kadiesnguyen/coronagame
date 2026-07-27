import { TINH_TRANG_GAME } from "@/configs/game.xocdia.config";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo, useEffect, useState } from "react";

const BoxContainer = styled(Box)(({ theme }) => ({
  bottom: "-3rem",
  display: "block",
  height: "20rem",
  left: "-1.5rem",
  margin: "auto",
  position: "relative",
  width: "22rem",
  "& img": {
    height: "auto",
    maxWidth: "100%",
  },
  "& .disc, .bowl": {
    position: "absolute",
  },
  "& .bowl": {
    WebkitAnimation: "movePoint 4s forwards",
    animation: "movePoint 4s forwards",
    height: "13rem",
    zIndex: 3,
  },
  "& .disc": {
    WebkitFilter: "drop-shadow(2px 4px 6px #000)",
    filter: "drop-shadow(2px 4px 6px black)",
    opacity: 0.7,
    right: "-2.5rem",
    top: "2.2rem",
    width: "22rem",
    zIndex: 1,
  },
  "& .result-dia": {
    fontSize: "1.3rem",
    "&>div": {
      left: "11rem",
      position: "absolute",
      top: "5rem",
      zIndex: 2,
      "&:nth-of-type(2)": { left: "9.5rem", top: "7rem" },
      "&:nth-of-type(3)": { left: "14rem", top: "6rem" },
      "&:nth-of-type(4)": { left: "12.5rem", top: "8rem" },
    },
  },

  "& .history_xucsac": {
    "&>.a0,.a1": {
      display: "inline-block",
      height: "1.425em",
      width: "1.425em",
    },
    "&>.a0": {
      backgroundImage: "url(/assets/images/xocdia_assets.png)",
      backgroundPositionX: "-4.631em",
      backgroundPositionY: "-.356em",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 6.483em",
    },
    "&>.a1": {
      backgroundImage: "url(/assets/images/xocdia_assets.png)",
      backgroundPositionX: "-2.493em",
      backgroundPositionY: "-0.356em",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 6.483em",
    },
  },
}));

const BoxQuay = ({ tinhTrang, ketQuaRandom, phienHoanTatMoiNhat }) => {
  const [ketQua, setKetQua] = useState(phienHoanTatMoiNhat?.ketQua ?? [0, 0, 0, 0, 0]);

  const [status, setStatus] = useState(null);
  useEffect(() => {
    if (phienHoanTatMoiNhat && phienHoanTatMoiNhat.ketQua) {
      setKetQua(phienHoanTatMoiNhat.ketQua);
    }
  }, [phienHoanTatMoiNhat]);

  useEffect(() => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      setKetQua(ketQuaRandom);
    }
  }, [ketQuaRandom]);

  const convertKetQua = (index) => {
    return ketQua[index];
  };

  return (
    <>
      <BoxContainer className="boxdia">
        <img
          alt=""
          src="/assets/images/dia-up.png"
          className="bowl"
          style={{
            animation:
              tinhTrang === TINH_TRANG_GAME.DANG_CHO
                ? `1s ease 0s 1 normal forwards running movePoint`
                : tinhTrang === TINH_TRANG_GAME.CHUAN_BI_QUAY
                ? `4s ease 0s 1 normal forwards running movePointBack`
                : tinhTrang === TINH_TRANG_GAME.DANG_QUAY
                ? `4s ease 0s 1 normal forwards running shake`
                : tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG
                ? `1s ease 0s 1 normal forwards running movePoint`
                : `1s ease 0s 1 normal forwards running movePoint`,
          }}
        />
        <img
          alt=""
          className="disc"
          src="/assets/images/dia-ngua.png"
          style={{
            animation: tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? `4s ease 0s 1 normal forwards running shake1` : null,
          }}
        />
        <div className="history_xucsac result-dia">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`a${convertKetQua(index)}`}></div>
          ))}
        </div>
      </BoxContainer>
    </>
  );
};
export default memo(BoxQuay);
