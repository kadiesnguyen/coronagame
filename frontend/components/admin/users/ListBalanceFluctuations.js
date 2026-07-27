import { ADMIN_USER_BALANCE_FLUCTUATIONS_PAGE_SIZE } from "@/configs/user.config";
import useGetBalanceFluctuationUser from "@/hooks/admin/useGetBalanceFluctuationUser";
import useGetCountAllBalanceFluctuationUser from "@/hooks/admin/useGetCountAllBalanceFluctuationUser";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
const ListBalanceFluctuations = ({ ID }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_USER_BALANCE_FLUCTUATIONS_PAGE_SIZE);
  const { data: dataQuery, isLoading } = useGetBalanceFluctuationUser({ page: page + 1, pageSize, userId: ID });
  const { data: rowCountState } = useGetCountAllBalanceFluctuationUser({ userId: ID });
  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      action: item._id,
      stt: i + 1,

      tienTruoc: item.tienTruoc,
      tienSau: item.tienSau,
      thayDoi: item.tienSau - item.tienTruoc,

      noiDung: item.noiDung,

      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },

    {
      field: "tienTruoc",
      headerName: "Tiền trước",
      width: 150,
      renderCell: (params) => {
        return convertJSXMoney(params.value);
      },
    },
    {
      field: "tienSau",
      headerName: "Tiền sau",
      width: 150,
      renderCell: (params) => {
        return convertJSXMoney(params.value);
      },
    },
    {
      field: "thayDoi",
      headerName: "Thay đổi",
      width: 150,
      renderCell: (params) => {
        return convertJSXMoney(params.value);
      },
    },

    {
      field: "noiDung",
      headerName: "Nội dung",
      width: 350,
    },

    { field: "createdAt", headerName: "Thời gian", width: 250 },
  ];

  return (
    <>
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Biến động số dư
      </h2>

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
export default ListBalanceFluctuations;
