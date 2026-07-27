import useGetVipLevels from "@/hooks/useGetVipLevels";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "@/utils/toast";
import Modal from "../../../homePage/Modal";
import BoxDatCuoc from "../BoxDatCuoc";
import BoxInfor from "../BoxInfor";
import BoxLichSu from "../BoxLichSu";
import BoxQuay from "../BoxQuay";

const VIP_META = {
  1: { label: "VIP 1", accent: "#cd7f32", glow: "rgba(205,127,50,.45)", Icon: EmojiEventsIcon },
  2: { label: "VIP 2", accent: "#c0c0c0", glow: "rgba(192,192,192,.4)", Icon: WorkspacePremiumIcon },
  3: { label: "VIP 3", accent: "#e5c05b", glow: "rgba(229,192,91,.55)", Icon: WorkspacePremiumIcon },
};

const VipCard = styled(Box)(({ active, locked, accent }) => ({
  borderRadius: "14px",
  padding: "14px 16px",
  cursor: locked ? "not-allowed" : "pointer",
  opacity: locked ? 0.55 : 1,
  width: "100%",
  minHeight: "56px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  border: active ? `2px solid ${accent}` : "1px solid rgba(212,175,55,.22)",
  background: active
    ? `linear-gradient(90deg, rgba(212,175,55,.22) 0%, #162948 55%, #101d33 100%)`
    : "#101d33",
  boxShadow: active ? `0 0 18px ${accent}55` : "none",
  transition: "border-color .2s ease, box-shadow .2s ease, background .2s ease",
}));

const iconFloat = {
  animate: {
    y: [0, -4, 0],
    rotate: [0, -6, 6, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
  },
};

const iconPulse = {
  animate: {
    scale: [1, 1.12, 1],
    filter: [
      "drop-shadow(0 0 0px rgba(229,192,91,0))",
      "drop-shadow(0 0 8px rgba(229,192,91,.85))",
      "drop-shadow(0 0 0px rgba(229,192,91,0))",
    ],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
  },
};

const RecordBet = ({ TYPE_GAME }) => {
  const router = useRouter();
  const { data: vipData, refetch: refetchVip } = useGetVipLevels();
  const balance = useSelector((state) => state.balance.balance);
  const [vipLevel, setVipLevel] = useState(1);
  const didInitVip = useRef(false);
  const {
    isPlayGame,
    phien,
    tinhTrang,
    timer: countdownTime,
    ketQua: ketQuaRandom,
    phienHoanTatMoiNhat,
  } = useSelector((state) => state.gameXucXac10P);

  useEffect(() => {
    const lvl = vipData?.currentLevel;
    if (!lvl) return;
    if (!didInitVip.current) {
      didInitVip.current = true;
      setVipLevel(lvl);
      return;
    }
    setVipLevel((prev) => (prev > lvl ? lvl : prev));
  }, [vipData?.currentLevel]);

  useEffect(() => {
    refetchVip();
  }, [balance, refetchVip]);

  const handleCloseModalPauseGame = () => {
    router.push("/");
  };

  const currentLevel = vipData?.currentLevel ?? null;
  const canEnterVip = (level) => Boolean(currentLevel && currentLevel >= level);

  const handleSelectVip = (level) => {
    if (!canEnterVip(level)) {
      toast.error("Tài khoản không đủ số dư để vào phòng VIP này");
      return;
    }
    setVipLevel(level);
  };

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
        <Typography sx={{ fontWeight: 800, marginBottom: "12px", textAlign: "center", fontSize: "1.8rem", color: "#fff" }}>
          Chọn cấp VIP
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          {[1, 2, 3].map((level) => {
            const locked = !canEnterVip(level);
            const active = vipLevel === level;
            const meta = VIP_META[level];
            const Icon = meta.Icon;
            return (
              <motion.div key={level} whileTap={locked ? undefined : { scale: 0.98 }} style={{ width: "100%" }}>
                <VipCard active={active} locked={locked} accent={meta.accent} onClick={() => handleSelectVip(level)}>
                  <motion.div
                    variants={active ? iconPulse : iconFloat}
                    animate="animate"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: `radial-gradient(circle at 30% 30%, ${meta.glow}, transparent 70%), #0b1528`,
                      border: `1px solid ${meta.accent}66`,
                      color: meta.accent,
                    }}
                  >
                    {locked ? <LockOutlinedIcon sx={{ fontSize: 24 }} /> : <Icon sx={{ fontSize: 26 }} />}
                  </motion.div>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.7rem", color: active ? meta.accent : "#fff", lineHeight: 1.2 }}>
                      {meta.label}
                    </Typography>
                    <Typography sx={{ fontSize: "1.2rem", color: locked ? "#8b95a8" : "#b8c0d4", mt: "2px" }}>
                      {locked ? "Chưa đủ điều kiện" : active ? "Đang chọn" : "Chạm để vào phòng"}
                    </Typography>
                  </Box>
                  {active && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.05, 0.9] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: meta.accent,
                        boxShadow: `0 0 10px ${meta.accent}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </VipCard>
              </motion.div>
            );
          })}
        </Box>
      </Box>

      {isPlayGame && canEnterVip(vipLevel) && (
        <BoxDatCuoc TYPE_GAME={TYPE_GAME} tinhTrang={tinhTrang} phien={phien} vipLevel={vipLevel} />
      )}

      <BoxLichSu TYPE_GAME={TYPE_GAME} vipLevel={vipLevel} />
    </>
  );
};
export default RecordBet;
