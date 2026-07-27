import { convertLoaiGame } from "@/configs/game.config";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { getAdminGameImage } from "./gameAssets";

const GameAdminShell = ({ typeGame, children, description }) => {
  const title = convertLoaiGame(typeGame);
  const img = getAdminGameImage(typeGame);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "120rem",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: { xs: "16px", md: "20px 24px" },
          borderRadius: "16px",
          background: "linear-gradient(145deg, #1a2f4d 0%, #162948 55%, #12243c 100%)",
          border: "1px solid rgba(212,175,55,.35)",
          width: "100%",
        }}
      >
        <Box sx={{ width: "7.2rem", height: "7.2rem", position: "relative", flexShrink: 0 }}>
          <Image src={img} alt={title} fill style={{ objectFit: "contain" }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: { xs: "2rem", md: "2.4rem" }, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
            Quản lý {title}
          </Typography>
          <Typography sx={{ fontSize: "1.4rem", color: "#b8c0d4", marginTop: "4px" }}>
            {description || "Lịch sử phiên · tỉ lệ trả thưởng · cấu hình auto"}
          </Typography>
        </Box>
      </Box>

      {children}
    </Box>
  );
};

export default GameAdminShell;
