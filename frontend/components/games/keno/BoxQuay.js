import { TINH_TRANG_GAME } from "@/configs/game.keno.config";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo, useEffect, useState } from "react";
const BoxContainer = styled(Box)(({ theme }) => ({
  background: "#00b977",
  borderRadius: "1rem",
  height: "12rem",
  marginTop: "3rem",
  padding: "1rem",
  position: "relative",
  "&:before, &:after": {
    content: `""`,
    display: "block",
    height: "0.69333rem",
    position: "absolute",
    top: "50%",

    transform: "translateY(-50%)",
    width: "0.13333rem",
    zIndex: 0,
  },
  "&:before": {
    background: "#008b59",
    borderRadius: "0.13333rem 0 0 0.13333rem",
    left: "-0.13333rem",
  },
  "&:after": {
    background: "#008b59",
    borderRadius: "0.13333rem 0 0 0.13333rem",
    right: "-0.13333rem",
  },
  "& .box": {
    gap: "5px",
    alignItems: "center",
    background: "#003c26",
    borderRadius: "0.13333rem",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    padding: "5px",
    position: "relative",
    width: "100%",
    "&:before, &:after": {
      content: `""`,
      borderBottom: "10px solid transparent",
      borderTop: "10px solid transparent",
      height: "0",
      position: "absolute",
      width: 0,
      zIndex: 3,
    },
    "&:before": {
      borderLeft: "15px solid #00b977",
      borderRight: "10px solid transparent",
      left: 0,
    },
    "&:after": {
      borderLeft: "10px solid transparent",
      borderRight: "15px solid #00b977",
      right: 0,
    },

    "& .slot-column": {
      background: "#333",
      borderRadius: "0.10667rem",
      display: "inline-block",
      height: "100%",
      overflow: "hidden",
      position: "relative",
      textAlign: "center",
      verticalAlign: "bottom",
      width: "calc(20% - 0.10667rem)",
      "& .slot-transform": {
        transform: "translateY(-11.7rem)",
        "&.slot-scroll": {
          WebkitAnimation: "slotScroll 3s cubic-bezier(0.65, 0.02, 0.65, 1.06) infinite",
          animation: "slotScroll 3s cubic-bezier(0.65, 0.02, 0.65, 1.06) infinite",
          WebkitAnimationFillMode: "forwards",
          animationFillMode: "forwards",
        },

        "& .slot-num": {
          background: "#e1e1ec",
          borderRadius: "50%",
          color: "#0006",
          fontSize: "3rem",
          fontWeight: 700,
          height: { xs: "4rem", md: "6rem" },
          lineHeight: { xs: "4rem", md: "6rem" },

          margin: "0 auto 5px",
          width: { xs: "4rem", md: "6rem" },
          "&.active": {
            background: "#00e065",
            color: "#fff",
          },
        },
      },
    },
  },
}));

const BoxQuay = ({ tinhTrang, ketQuaRandom, phienHoanTatMoiNhat }) => {
  const [ketQua, setKetQua] = useState(phienHoanTatMoiNhat?.ketQua ?? [0, 0, 0, 0, 0]);
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
      <Box
        className="box-quay"
        sx={{
          background: "#00b977",
          borderRadius: "1rem",
          height: "12rem",
          marginTop: "3rem",
          padding: "1rem",
          position: "relative",
          "&:before, &:after": {
            content: `""`,
            display: "block",
            height: "0.69333rem",
            position: "absolute",
            top: "50%",

            transform: "translateY(-50%)",
            width: "0.13333rem",
            zIndex: 0,
          },
          "&:before": {
            background: "#008b59",
            borderRadius: "0.13333rem 0 0 0.13333rem",
            left: "-0.13333rem",
          },
          "&:after": {
            background: "#008b59",
            borderRadius: "0.13333rem 0 0 0.13333rem",
            right: "-0.13333rem",
          },
          "& .box": {
            gap: "5px",
            alignItems: "center",
            background: "#003c26",
            borderRadius: "0.13333rem",
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            padding: "5px",
            position: "relative",
            width: "100%",
            "&:before, &:after": {
              content: `""`,
              borderBottom: "10px solid transparent",
              borderTop: "10px solid transparent",
              height: "0",
              position: "absolute",
              width: 0,
              zIndex: 3,
            },
            "&:before": {
              borderLeft: "15px solid #00b977",
              borderRight: "10px solid transparent",
              left: 0,
            },
            "&:after": {
              borderLeft: "10px solid transparent",
              borderRight: "15px solid #00b977",
              right: 0,
            },

            "& .slot-column": {
              background: "#333",
              borderRadius: "0.10667rem",
              display: "inline-block",
              height: "100%",
              overflow: "hidden",
              position: "relative",
              textAlign: "center",
              verticalAlign: "bottom",
              width: "calc(20% - 0.10667rem)",
              "& .slot-transform": {
                transform: { xs: "translateY(-11.7rem)", sm: "translateY(-11.7rem)" },
                "&.slot-scroll": {
                  WebkitAnimation: "slotScroll 3s cubic-bezier(0.65, 0.02, 0.65, 1.06) infinite",
                  animation: "slotScroll 3s cubic-bezier(0.65, 0.02, 0.65, 1.06) infinite",
                  WebkitAnimationFillMode: "forwards",
                  animationFillMode: "forwards",
                },

                "& .slot-num": {
                  background: "#e1e1ec",
                  borderRadius: "50%",
                  color: "#0006",
                  fontSize: { xs: "3rem", sm: "3rem" },
                  fontWeight: 700,
                  height: { xs: "6rem", sm: "6rem" },
                  lineHeight: { xs: "6rem", sm: "6rem" },

                  margin: "0 auto 5px",
                  maxWidth: { xs: "6rem", sm: "6rem" },
                  "&.active": {
                    background: "#00e065",
                    color: "#fff",
                  },
                },
              },
            },
          },
        }}
      >
        <Box className="box">
          {Array.from({ length: 5 }).map((_, i) => (
            <Box className="slot-column" key={i}>
              <Box
                className={tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? "slot-transform slot-scroll" : "slot-transform"}
                data-col={i}
              >
                <Box className="slot-num">0</Box>
                <Box className="slot-num">1</Box>
                <Box className="slot-num active">{convertKetQua(i)}</Box>
                <Box className="slot-num">2</Box>
                <Box className="slot-num">3</Box>
                <Box className="slot-num">4</Box>
                <Box className="slot-num">5</Box>
                <Box className="slot-num">6</Box>
                <Box className="slot-num">7</Box>
                <Box className="slot-num">8</Box>
                <Box className="slot-num">9</Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
export default memo(BoxQuay);
