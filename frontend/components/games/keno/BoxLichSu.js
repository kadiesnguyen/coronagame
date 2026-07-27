import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import LichSuCuoc from "./LichSuCuoc";
import LichSuGame from "./LichSuGame";
import LichSuGameChart from "./LichSuGameChart";
const ButtonTabChange = styled(Box)(({ theme }) => ({
  display: "flex",
  backgroundColor: "#e8e7e8",
  color: "#000",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "1.5rem",
  padding: "10px",
  width: "50%",
  justifyContent: "center",
  "&.active": {
    backgroundColor: "#ff0000",
    color: "#fff",
    boxShadow: "0 0 16px rgba(0,0,0,.25)",
  },
}));

const BoxLichSu = ({ TYPE_GAME }) => {
  const TYPE_TAB = {
    GAME_HISTORY: "Lịch sử trò chơi",
    USER_BET_HISTORY: "Lịch sử của tôi",
  };
  const COMPONENT_TAB = {
    GAME_HISTORY: <LichSuGame TYPE_GAME={TYPE_GAME} />,
    USER_BET_HISTORY: <LichSuCuoc TYPE_GAME={TYPE_GAME} />,
  };
  const [tabPage, setTabPage] = useState(Object.keys(TYPE_TAB)[0]);
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <LichSuGameChart isModal={isModal} setIsModal={setIsModal} TYPE_GAME={TYPE_GAME} />
      <Box
        sx={{
          paddingTop: "1rem",
          textAlign: "center",
        }}
      >
        <Button onClick={() => setIsModal(true)}>Thống kê game</Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          margin: { xs: "1rem", md: "2rem" },
        }}
      >
        {Object.keys(TYPE_TAB).map((key, i) => (
          <ButtonTabChange key={i} onClick={() => setTabPage(key)} className={tabPage === key ? "active" : null}>
            {TYPE_TAB[key]}
          </ButtonTabChange>
        ))}
      </Box>
      {COMPONENT_TAB[tabPage]}
    </>
  );
};
export default BoxLichSu;
