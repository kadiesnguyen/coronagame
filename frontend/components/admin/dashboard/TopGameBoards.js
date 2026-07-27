import SocketContext from "@/context/socket";
import useGetTopGameDashboard from "@/hooks/admin/useGetTopGameDashboard";
import { formatCompactMoney } from "@/utils/convertMoney";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import { useContext, useEffect } from "react";

const RESULTS_DATE_RANGE = 7;

const RANK_COLOR = ["#d4af37", "#c0c0c0", "#cd7f32", "#8b95a8", "#8b95a8"];

const TopListCard = ({ title, subtitle, rows, accent, Icon, emptyText }) => (
  <Box
    sx={{
      height: "100%",
      minHeight: 280,
      backgroundColor: "#162948",
      border: "1px solid rgba(212,175,55,.25)",
      borderRadius: "16px",
      padding: { xs: "14px", md: "18px" },
      boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      color: "#fff",
      minWidth: 0,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "1.35rem", color: "#8b95a8", fontWeight: 600 }}>{title}</Typography>
        <Typography sx={{ fontSize: "1.2rem", color: "#b8c0d4", mt: "2px" }}>{subtitle}</Typography>
      </Box>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 30% 30%, ${accent}55, transparent 70%), #101d33`,
          border: `1px solid ${accent}66`,
          color: accent,
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      {rows.length === 0 ? (
        <Typography sx={{ color: "#8b95a8", textAlign: "center", py: "24px", fontSize: "1.3rem" }}>
          {emptyText}
        </Typography>
      ) : (
        rows.map((row) => (
          <Link
            key={row.userId}
            href={`/admin/users/${row.userId}`}
            style={{ textDecoration: "none", color: "inherit", minWidth: 0 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minHeight: 48,
                px: "12px",
                borderRadius: "12px",
                backgroundColor: "#101d33",
                border: "1px solid rgba(255,255,255,.06)",
                transition: "border-color .15s ease",
                "&:hover": { borderColor: `${accent}88` },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "#0b1528",
                  backgroundColor: RANK_COLOR[row.rank - 1] || "#8b95a8",
                }}
              >
                {row.rank}
              </Box>
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.taiKhoan}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: accent, flexShrink: 0, lineHeight: 1 }}>
                {formatCompactMoney(row.amount)}
              </Typography>
            </Box>
          </Link>
        ))
      )}
    </Box>
  </Box>
);

const TopGameBoards = () => {
  const { socket } = useContext(SocketContext);
  const { data, isLoading, refetch } = useGetTopGameDashboard({ days: RESULTS_DATE_RANGE });

  useEffect(() => {
    if (!socket) return undefined;
    const onRefetch = () => refetch();
    socket.on("admin:refetch-data-game-transactionals-dashboard", onRefetch);
    return () => {
      socket.off("admin:refetch-data-game-transactionals-dashboard", onRefetch);
    };
  }, [socket, refetch]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: "32px" }}>
        <CircularProgress size={36} sx={{ color: "#d4af37" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: "12px",
      }}
    >
      <TopListCard
        title="Top 5 thắng"
        subtitle={`${RESULTS_DATE_RANGE} ngày gần nhất`}
        rows={data.topThang || []}
        accent="#d4af37"
        Icon={EmojiEventsOutlinedIcon}
        emptyText="Chưa có dữ liệu thắng"
      />
      <TopListCard
        title="Top 5 cược"
        subtitle={`${RESULTS_DATE_RANGE} ngày gần nhất`}
        rows={data.topCuoc || []}
        accent="#1fc67c"
        Icon={SportsEsportsOutlinedIcon}
        emptyText="Chưa có dữ liệu cược"
      />
    </Box>
  );
};

export default TopGameBoards;
