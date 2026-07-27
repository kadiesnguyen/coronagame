import { ADMIN_USER_ACTIVITIES_PAGE_SIZE } from "@/configs/user.config";
import useGetCountAllActivitiesUser from "@/hooks/admin/useGetCountAllActivitiesUser";
import useGetListActivitiesUser from "@/hooks/admin/useGetListActivitiesUser";
import { convertDateTime } from "@/utils/convertTime";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
const ListActivities = ({ ID }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_USER_ACTIVITIES_PAGE_SIZE);
  const { data: dataQuery, isLoading } = useGetListActivitiesUser({ page: page + 1, pageSize, userId: ID });
  const { data: rowCountState } = useGetCountAllActivitiesUser({ userId: ID });
  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      action: item._id,
      stt: i + 1,
      metadata: item.metadata,
      description: item.description,
      browser: item.userAgent?.browser,
      os: item.userAgent?.os,

      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },

    {
      field: "description",
      headerName: "Hành động",
      width: 350,
    },
    {
      field: "browser",
      headerName: "Browser",
      width: 150,
    },
    {
      field: "os",
      headerName: "OS",
      width: 150,
    },

    { field: "createdAt", headerName: "Thời gian", width: 200 },
    {
      field: "metadata",
      headerName: "Metadata",
      width: 900,

      renderCell: (params) => {
        return JSON.stringify(params.row.metadata);
      },
    },
  ];

  return (
    <>
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Nhật ký hoạt động
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
          getRowHeight={() => "auto"}
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
export default ListActivities;
