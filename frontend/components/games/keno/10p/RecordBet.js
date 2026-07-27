import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../../homePage/Modal";
import useGetVipLevels from "@/hooks/useGetVipLevels";
import convertMoney from "@/utils/convertMoney";
import BoxDatCuoc from "../BoxDatCuoc";
import BoxInfor from "../BoxInfor";
import BoxQuay from "../BoxQuay";
import BoxLichSu from "../BoxLichSu";

const VipTab = styled(Box)(({ theme, active, locked }) => ({
  borderRadius: "12px",
  padding: "12px 16px",
  cursor: locked ? "not-allowed" : "pointer",
  opacity: locked ? 0.55 : 1,
  textAlign: "center",
  border: active ? "2px solid #d4af37" : "1px solid rgba(212,175,55,.25)",
  backgroundColor: active ? "rgba(212,175,55,.15)" : "#101d33",
  color: active ? "#e5c05b" : "#fff",
  minHeight: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const RecordBet = ({ TYPE_GAME }) => {
  const router = useRouter();
  const { data: vipData } = useGetVipLevels();
  const [vipLevel, setVipLevel] = useState(1);
  const {
    isPlayGame,
    phien,
    tinhTrang,
    timer: countdownTime,
    ketQua: ketQuaRandom,
    phienHoanTatMoiNhat,
  } = useSelector((state) => state.gameKeno10P);

  useEffect(() => {
    if (vipData?.currentLevel) {
      setVipLevel(vipData.currentLevel);
    }
  }, [vipData?.currentLevel]);

  const handleCloseModalPauseGame = () => {
    router.push("/");
  };

  const currentLevel = vipData?.currentLevel ?? null;
  const vipLevels = vipData?.vipLevels ?? {};

  return (
    <>
      <Modal isModal={!isPlayGame} setIsModal={handleCloseModalPauseGame} title={"Game đã tạm dừng"}>
        <Typography>Game đang bị tạm dừng</Typography>
      </Modal>

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

      <Box sx={{ marginTop: "1rem" }}>
        <Typography sx={{ fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>Chọn nấc VIP</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" },
            gap: "12px",
          }}
        >
          {[1, 2, 3].map((level) => {
            const cfg = vipLevels[`vip${level}`] ?? {};
            const locked = currentLevel !== level;
            return (
              <VipTab
                key={level}
                active={vipLevel === level}
                locked={locked}
                onClick={() => {
                  if (!locked) setVipLevel(level);
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>VIP{level}</Typography>
                  <Typography sx={{ fontSize: "1.2rem" }}>
                    {convertMoney(cfg.minMoney ?? 0)} – {cfg.maxMoney ? convertMoney(cfg.maxMoney) : "∞"}
                  </Typography>
                  {locked && (
                    <Typography sx={{ fontSize: "1.1rem", marginTop: "4px" }}>Số dư chưa đủ điều kiện</Typography>
                  )}
                </Box>
              </VipTab>
            );
          })}
        </Box>
      </Box>

      {isPlayGame && currentLevel === vipLevel && (
        <BoxDatCuoc TYPE_GAME={TYPE_GAME} tinhTrang={tinhTrang} phien={phien} vipLevel={vipLevel} />
      )}

      <BoxLichSu TYPE_GAME={TYPE_GAME} vipLevel={vipLevel} />
    </>
  );
};
export default RecordBet;
