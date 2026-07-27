import useGetListUserBank from "@/hooks/admin/useGetListUserBank";
import { convertDateTime } from "@/utils/convertTime";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ListUserBank = ({ ID }) => {
  const { data: dataQuery, isLoading } = useGetListUserBank({ userId: ID });

  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      action: item._id,
      stt: i + 1,
      tenNganHang: item.tenNganHang,
      soTaiKhoan: item.soTaiKhoan,
      tenChuTaiKhoan: item.tenChuTaiKhoan,
      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "tenNganHang", headerName: "Tên ngân hàng", width: 200 },
    {
      field: "soTaiKhoan",
      headerName: "STK",
      width: 250,
    },
    { field: "tenChuTaiKhoan", headerName: "Chủ tài khoản", width: 250 },

    { field: "createdAt", headerName: "Thời gian tạo", width: 250 },
  ];

  return (
    <>
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách ngân hàng
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
          loading={isLoading}
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
export default ListUserBank;
