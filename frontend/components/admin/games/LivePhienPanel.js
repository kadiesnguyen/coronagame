import SocketContext from "@/context/socket";
import useGetGameHistory from "@/hooks/admin/useGetGameHistory";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useMemo } from "react";
import AdminSection from "./AdminSection";

const DEFAULT_LIVE = new Set(["dangCho", "dangQuay", "dangTraThuong", "chuanBiQuay"]);

const LivePhienPanel = ({ TYPE_GAME, ChiTietPhien, LichSuCuoc, isLiveStatus }) => {
  const { socket } = useContext(SocketContext);
  const { data, isLoading, refetch } = useGetGameHistory({
    typeGame: TYPE_GAME,
    page: 1,
    pageSize: 10,
    searchValue: "",
  });

  const livePhien = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const check = isLiveStatus || ((tinhTrang) => DEFAULT_LIVE.has(tinhTrang));
    return rows.find((item) => check(item?.tinhTrang)) ?? null;
  }, [data, isLiveStatus]);

  const liveId = livePhien?._id ? String(livePhien._id) : "";

  useEffect(() => {
    if (!socket) return undefined;
    socket.emit(`${TYPE_GAME}:join-room-admin`);
    const onRefetch = () => refetch();
    socket.on(`${TYPE_GAME}:admin:refetch-data-game`, onRefetch);
    socket.on(`${TYPE_GAME}:admin:hoanTatGame`, onRefetch);
    socket.on(`${TYPE_GAME}:admin:batDauGame`, onRefetch);
    // some games emit without admin: prefix
    socket.on(`${TYPE_GAME}:refetch-data-game`, onRefetch);
    return () => {
      socket.off(`${TYPE_GAME}:admin:refetch-data-game`, onRefetch);
      socket.off(`${TYPE_GAME}:admin:hoanTatGame`, onRefetch);
      socket.off(`${TYPE_GAME}:admin:batDauGame`, onRefetch);
      socket.off(`${TYPE_GAME}:refetch-data-game`, onRefetch);
    };
  }, [socket, TYPE_GAME, refetch]);

  return (
    <AdminSection
      title="Phiên đang live"
      subtitle="Chi tiết + lịch sử cược phiên chưa ra kết quả"
      sx={{ overflow: "hidden" }}
    >
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={28} sx={{ color: "#e5c05b" }} />
        </Box>
      )}
      {!isLoading && !liveId && (
        <Typography sx={{ color: "#b8c0d4", fontSize: "1.4rem" }}>
          Không có phiên đang chạy. Phiên đã xong xem qua icon info trong danh sách bên dưới.
        </Typography>
      )}
      {!!liveId && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            position: "relative",
            zIndex: 0,
          }}
        >
          <ChiTietPhien ID={liveId} TYPE_GAME={TYPE_GAME} />
          <LichSuCuoc ID={liveId} TYPE_GAME={TYPE_GAME} />
        </Box>
      )}
    </AdminSection>
  );
};

export default LivePhienPanel;
