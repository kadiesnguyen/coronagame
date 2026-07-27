import SocketContext from "@/context/socket";
import useGetDetailedBetGameHistory from "@/hooks/admin/useGetDetailedBetGameHistory";
import { convertDateTime } from "@/utils/convertTime";
import { convertChiTietCuoc } from "@/utils/xucxac";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { adminDataGridSx } from "../adminDataGridSx";

const transformDataGrid = (dataQuery) =>
  dataQuery?.map((item, i) => ({
    id: item._id,
    nguoiDung: item.nguoiDung.taiKhoan,
    noiDung: item.datCuoc,
    tongTienCuoc: item.datCuoc.reduce((a, b) => a + b.tienCuoc, 0),
    stt: i + 1,
    ketQua: item.ketQua,
    tinhTrang: item.tinhTrang,
    createdAt: convertDateTime(item.createdAt),
  })) ?? [];

const LichSuCuoc = ({ ID, TYPE_GAME = "xucxac1p" }) => {
  const { socket } = useContext(SocketContext);
  const { data: dataQuery, isLoading, refetch } = useGetDetailedBetGameHistory({ typeGame: TYPE_GAME, id: ID });
  const [data, setData] = useState(transformDataGrid(dataQuery));

  useEffect(() => {
    if (!socket) return undefined;
    socket.emit(`${TYPE_GAME}:join-room-admin`);
    const onRefetch = ({ phien }) => {
      if (phien == ID) refetch();
    };
    socket.on(`${TYPE_GAME}:admin:refetch-data-lich-su-cuoc-game`, onRefetch);
    return () => socket.off(`${TYPE_GAME}:admin:refetch-data-lich-su-cuoc-game`, onRefetch);
  }, [socket, TYPE_GAME, ID, refetch]);

  useEffect(() => {
    if (dataQuery) setData(transformDataGrid(dataQuery));
  }, [dataQuery]);

  const columns = useMemo(
    () => [
      { field: "stt", headerName: "STT", width: 64, align: "center", headerAlign: "center" },
      { field: "nguoiDung", headerName: "Người dùng", flex: 1, minWidth: 100 },
      {
        field: "noiDung",
        headerName: "Nội dung",
        flex: 1.6,
        minWidth: 140,
        renderCell: (params) => (
          <Box sx={{ py: 0.5, minWidth: 0 }}>
            {params.row.noiDung.map((item, i) => (
              <Typography key={i} sx={{ fontSize: "1.2rem", lineHeight: 1.35 }}>
                {convertChiTietCuoc({ chiTietCuoc: item.chiTietCuoc, loaiCuoc: item.loaiCuoc })} -{" "}
                <NumericFormat value={item.tienCuoc} displayType="text" allowLeadingZeros thousandSeparator="," />đ
              </Typography>
            ))}
          </Box>
        ),
      },
      {
        field: "tongTienCuoc",
        headerName: "Tổng cược",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <NumericFormat value={params.value} displayType="text" allowLeadingZeros thousandSeparator="," suffix="đ" />
        ),
      },
      {
        field: "tinhTrang",
        headerName: "Tình trạng",
        flex: 0.9,
        minWidth: 90,
        cellClassName: (params) => {
          if (params.value === "đang chờ") return "trangthai_dangcho";
          if (params.value === "hoàn tất") return "trangthai_hoantat";
          return "";
        },
        valueGetter: (params) => {
          if (params.row.tinhTrang === "dangCho") return "đang chờ";
          if (params.row.tinhTrang === "hoanTat") return "hoàn tất";
          return "";
        },
      },
      { field: "createdAt", headerName: "Thời gian", flex: 1, minWidth: 110 },
    ],
    []
  );

  return (
    <Box sx={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 0 }}>
      <Typography className="title" sx={{ fontSize: "2rem", fontWeight: 700, color: "#e5c05b", textAlign: "center", margin: 0 }}>
        Lịch sử cược
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={28} sx={{ color: "#e5c05b" }} />
        </Box>
      )}
      {!isLoading && (
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            height: 360,
            overflow: "hidden",
            position: "relative",
            zIndex: 0,
            borderRadius: "12px",
            "& .trangthai_hoantat": { color: "#1fc67c" },
            "& .trangthai_dangcho": { color: "#e5c05b" },
            "& .MuiDataGrid-root": { overflow: "hidden" },
            "& .MuiDataGrid-main": { overflow: "hidden" },
            "& .MuiDataGrid-virtualScroller": { overflowX: "hidden !important" },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            getRowHeight={() => "auto"}
            disableColumnMenu
            disableSelectionOnClick
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              ...adminDataGridSx,
              height: "100%",
              width: "100%",
              maxWidth: "100%",
              "& .MuiDataGrid-cell": { ...adminDataGridSx["& .MuiDataGrid-cell"], alignItems: "flex-start", py: "8px" },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default LichSuCuoc;
