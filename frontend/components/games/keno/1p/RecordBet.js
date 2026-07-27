import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import BoxDatCuoc from "../BoxDatCuoc";
import BoxInfor from "../BoxInfor";
import BoxQuay from "../BoxQuay";
const RecordBet = ({ TYPE_GAME }) => {
  const router = useRouter();
  const {
    isPlayGame,
    phien,
    tinhTrang,
    timer: countdownTime,
    ketQua: ketQuaRandom,
    phienHoanTatMoiNhat,
  } = useSelector((state) => state.gameKeno1P);

  return (
    <>
      <Box
        sx={{
          borderRadius: "2rem",
          padding: { xs: "1rem", md: "2rem" },
          marginTop: "1rem",
          backgroundColor: "background.default",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <BoxInfor phien={phien} countdownTime={countdownTime} tinhTrang={tinhTrang} />
        <BoxQuay tinhTrang={tinhTrang} ketQuaRandom={ketQuaRandom} phienHoanTatMoiNhat={phienHoanTatMoiNhat} />
      </Box>
      {isPlayGame && (
        <>
          <BoxDatCuoc TYPE_GAME={TYPE_GAME} tinhTrang={tinhTrang} phien={phien} />
        </>
      )}
    </>
  );
};
export default RecordBet;
