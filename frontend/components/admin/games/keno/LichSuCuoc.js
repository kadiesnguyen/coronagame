import SocketContext from "@/context/socket";
import { Box, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

import useGetDetailedBetGameHistory from "@/hooks/admin/useGetDetailedBetGameHistory";
import { convertDateTime } from "@/utils/convertTime";

const transformDataGrid = (dataQuery) => {
  const newData =
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
  return newData;
};
const LichSuCuoc = ({ ID, TYPE_GAME = "keno1p" }) => {
  const { socket } = useContext(SocketContext);
  const {
    data: dataQuery,
    isLoading,
    refetch,
  } = useGetDetailedBetGameHistory({
    typeGame: TYPE_GAME,
    id: ID,
  });
  const [data, setData] = useState(transformDataGrid(dataQuery));

  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room-admin`);
      socket.on(`${TYPE_GAME}:admin:refetch-data-lich-su-cuoc-game`, ({ phien }) => {
        if (phien == ID) {
          refetch();
        }
      });
      return () => {
        socket.off(`${TYPE_GAME}:admin:refetch-data-lich-su-cuoc-game`);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (dataQuery) {
      setData(transformDataGrid(dataQuery));
    }
  }, [dataQuery]);

  const GridRowsProp = data;

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "nguoiDung", headerName: "Nguời dùng", width: 100 },
    {
      field: "noiDung",
      headerName: "Nội dung",
      width: 250,
      height: 200,
      renderCell: (params) => (
        <Box>
          {params.row.noiDung.map((item, i) => (
            <Box
              key={i}
              sx={{
                fontSize: "1.2rem",
              }}
            >
              Bi {item.loaiBi}- {item.loaiCuoc} -{" "}
              <NumericFormat value={item.tienCuoc} displayType="text" allowLeadingZeros thousandSeparator="," />đ
            </Box>
          ))}
        </Box>
      ),
    },
    {
      field: "tongTienCuoc",
      headerName: "Tổng tiền cược",
      width: 200,
      renderCell: (params) => (
        <NumericFormat value={params.value} displayType="text" allowLeadingZeros thousandSeparator="," suffix="đ" />
      ),
    },
    {
      field: "tinhTrang",
      headerName: "Tình trạng",
      width: 250,
      cellClassName: (params) => {
        if (params.value === "đang chờ") {
          return "trangthai_dangcho";
        } else if (params.value === "hoàn tất") {
          return "trangthai_hoantat";
        } else {
          return "";
        }
      },
      valueGetter: (params) => {
        if (params.row.tinhTrang === "dangCho") {
          return "đang chờ";
        } else if (params.row.tinhTrang === "hoanTat") {
          return "hoàn tất";
        } else {
          return "";
        }
      },
    },
    { field: "createdAt", headerName: "Thời gian", width: 250 },
  ];

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",

          height: 500,
          width: "100%",
          "& .trangthai_hoantat": {
            color: "#1fc67c",
          },
          "& .trangthai_dangcho": {
            color: "#1a3e72",
          },

          "& .MuiPaper-root ": {
            color: "#000000",
          },
        }}
      >
        <h1
          className="title"
          style={{
            justifyContent: "center",
            fontSize: "2.5rem",
          }}
        >
          Lịch sử cược
        </h1>
        {isLoading && <CircularProgress color="inherit" />}

        {!isLoading && (
          <>
            <DataGrid
              rows={GridRowsProp}
              columns={GridColDef}
              componentsProps={{
                panel: {
                  sx: {
                    "& .MuiTypography-root": {
                      color: "dodgerblue",
                      fontSize: 20,
                    },
                    "& .MuiDataGrid-filterForm": {
                      bgcolor: "lightblue",
                    },
                  },
                },
              }}
              sx={{
                color: "#000000",
                "& .MuiDataGrid-paper": {
                  color: "#000000",
                },
                "& .MuiToolbar-root": {
                  color: "#000000",
                },
                "& .MuiMenuItem-root": {
                  color: "#000000",
                },
              }}
            />
          </>
        )}
      </Box>
    </>
  );
};
export default LichSuCuoc;
