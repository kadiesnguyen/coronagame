import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { Box, Typography } from "@mui/material";

const statusStyle = (trangThai) => {
  if (trangThai === "thang") {
    return { label: "Win", bg: "#1fc67c", color: "#fff" };
  }
  if (trangThai === "thua") {
    return { label: "Lose", bg: "#e74c3c", color: "#fff" };
  }
  return { label: "Pending", bg: "rgba(229,192,91,.25)", color: "#e5c05b" };
};

const Item = ({ item }) => {
  const status = statusStyle(item.trangThai);

  return (
    <Box
      sx={{
        padding: "14px 4px",
        borderBottom: "1px solid rgba(255,255,255,.12)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        color: "#fff",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.6rem" }}>{item.gameName}</Typography>
          <Box
            sx={{
              backgroundColor: status.bg,
              color: status.color,
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "1.2rem",
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            {status.label}
          </Box>
        </Box>
        <Typography sx={{ color: "#b8c0d4", fontSize: "1.3rem" }}>Phiên cược: {item.phien || "-"}</Typography>
        <Typography sx={{ color: "#b8c0d4", fontSize: "1.3rem" }}>{item.detail}</Typography>
      </Box>
      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#e5c05b" }}>
          {convertJSXMoney(item.tienCuoc)}
        </Typography>
        <Typography sx={{ color: "#b8c0d4", fontSize: "1.2rem", marginTop: "8px" }}>
          {convertDateTime(item.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Item;
