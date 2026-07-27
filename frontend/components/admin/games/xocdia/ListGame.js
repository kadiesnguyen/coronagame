import SocketContext from "@/context/socket";
import useGetCountAllGame from "@/hooks/admin/useGetCountAllGame";
import useGetGameHistory from "@/hooks/admin/useGetGameHistory";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangGameXucXac, convertTinhTrangGameXucXac } from "@/utils/convertTinhTrang";
import InfoIcon from "@mui/icons-material/Info";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import BoxSearch from "./BoxSearch";
const PAGE_SIZE = 10;

const ListGame = ({ TYPE_GAME = "keno1p" }) => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const {
    data: dataQuery,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useGetGameHistory({ typeGame: TYPE_GAME, page: page + 1, pageSize, searchValue });

  const { data: rowCountState } = useGetCountAllGame({
    typeGame: TYPE_GAME,
    searchValue,
  });
  const GridRowsProp =
    dataQuery?.map((item) => ({
      id: item._id,
      action: item._id,
      phien: item.phien,
      ketQua: item.ketQua,
      tinhTrang: item.tinhTrang,
      createdAt: item.createdAt,
    })) ?? [];

  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room-admin`);
      socket.off(`${TYPE_GAME}:admin:refetch-data-game`).on(`${TYPE_GAME}:admin:refetch-data-game`, () => {
        refetch();
      });
      return () => {
        socket.off(`${TYPE_GAME}:admin:refetch-data-game`);
      };
    }
  }, [socket]);

  const GridColDef = [
    { field: "phien", headerName: "Phiên", width: 100 },
    {
      field: "ketQua",
      headerName: "Kết quả",
      width: 250,
      renderCell: (params) => {
        return (
          <Box
            className="history_xucsac"
            sx={{
              display: "flex",
              gap: "0.25rem",
            }}
          >
            {params?.value?.map((item, i) => (
              <div key={i} className={`a${item}`}></div>
            ))}
          </Box>
        );
      },
    },
    {
      field: "tinhTrang",
      headerName: "Tình trạng",
      width: 250,
      renderCell: (params) => {
        return convertJSXTinhTrangGameXucXac(params.row.tinhTrang);
      },

      valueGetter: (params) => {
        return convertTinhTrangGameXucXac(params.row.tinhTrang);
      },
    },
    {
      field: "createdAt",
      headerName: "Thời gian",
      width: 250,
      valueGetter: (params) => {
        return convertDateTime(params.value);
      },
    },
    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <IconButton title="Chi tiết" onClick={() => router.push(`/admin/games/${TYPE_GAME}/${params.id}`)}>
          <InfoIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <>
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách game
      </h1>

      <BoxSearch searchValue={searchValue} setSearchValue={setSearchValue} />
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
        <DataGrid
          rowsPerPageOptions={[10, 50, 100]}
          pagination
          rowCount={rowCountState ?? 0}
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          loading={isLoading}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
      </Box>
    </>
  );
};
export default ListGame;
