import { Box, Button, Typography } from "@mui/material";
import { memo, useState } from "react";
import BangKetQua from "./BangKetQua";
import BangLichSuCuoc from "./BangLichSuCuoc";
import BoxQuay from "./BoxQuay";
import CountdownTimer from "./CountdownTimer";

const BoxInfor = ({ TYPE_GAME, phien, countdownTime, tinhTrang, phienHoanTatMoiNhat, ketQuaRandom }) => {
  const [isModalKetQua, setIsModalKetQua] = useState(false);
  const [isModalLichSuCuoc, setIsModalLichSuCuoc] = useState(false);

  return (
    <>
      <BangKetQua isModal={isModalKetQua} setIsModal={setIsModalKetQua} phienHoanTatMoiNhat={phienHoanTatMoiNhat} />
      <BangLichSuCuoc TYPE_GAME={TYPE_GAME} isModal={isModalLichSuCuoc} setIsModal={setIsModalLichSuCuoc} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1, minmax(0, 1fr))", md: "repeat(2, minmax(0, 1fr))" },
          gap: "10px",
        }}
      >
        <Box
          sx={{
            borderRight: { md: "1px solid #eee" },
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Typography
              sx={{
                color: "#b7b7b7",
                fontSize: "1.8rem",
              }}
            >
              Phiên số
            </Typography>
            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              {phien}
            </Typography>
          </Box>
          <CountdownTimer countdownTime={countdownTime} />
          <Button
            onClick={() => setIsModalLichSuCuoc(true)}
            sx={{
              border: "1px solid rgb(71, 123, 255)",
              color: "rgb(71, 123, 255)",
              background: "unset",
              fontSize: "1.4rem",
            }}
          >
            Lịch sử của bạn
          </Button>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              gap: "0.5rem",
              padding: "0px 20px",
            }}
          >
            <Typography
              sx={{
                color: "#b7b7b7",
                fontSize: "1.8rem",
              }}
            >
              Kết quả phiên
            </Typography>
            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              {phien != 0 ? phien - 1 : 0}
            </Typography>
          </Box>

          <BoxQuay tinhTrang={tinhTrang} ketQuaRandom={ketQuaRandom} phienHoanTatMoiNhat={phienHoanTatMoiNhat} />

          <Button
            sx={{
              border: "1px solid rgb(0, 185, 119)",
              color: "rgb(0, 185, 119)",
              background: "unset",
              fontSize: "1.4rem",
            }}
            onClick={() => setIsModalKetQua(true)}
          >
            Chi tiết kết quả
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default memo(BoxInfor);
