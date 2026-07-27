import { ADMIN_LIST_NOTIFICATIONS_PAGE_SIZE } from "@/configs/notification.config";
import useGetCountAllNotification from "@/hooks/admin/useGetCountAllNotification";
import useGetListNotifications from "@/hooks/admin/useGetListNotifications";
import { convertDateTime } from "@/utils/convertTime";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import BreadcrumbBar from "../../BreadcrumbBar";
const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý thông báo",
    href: "/admin/settings/thongbao",
  },
];
const ListNotification = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_LIST_NOTIFICATIONS_PAGE_SIZE);
  const { data: dataQuery, isLoading } = useGetListNotifications({ page: page + 1, pageSize });
  const { data: rowCountState } = useGetCountAllNotification();
  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      action: item._id,
      stt: i + 1,
      tieuDe: item.tieuDe,
      noiDung: item.noiDung,
      hinhAnh: item.hinhAnh,
      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "tieuDe", headerName: "Tiêu đề", width: 250 },
    {
      field: "hinhAnh",
      headerName: "Hình ảnh",
      width: 250,
      renderCell: (params) => {
        return (
          <img
            src={params.value}
            style={{
              width: "100px",
              height: "50px",
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      field: "noiDung",
      headerName: "Nội dung",
      width: 250,
      renderCell: (params) => {
        return <div className="content-html" dangerouslySetInnerHTML={{ __html: params.value }} />;
      },
    },

    { field: "createdAt", headerName: "Thời gian tạo", width: 250 },

    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <IconButton onClick={() => router.push(`/admin/settings/notifications/${params.id}`)}>
          <InfoIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách thông báo
      </h1>
      <Link href="/admin/settings/notifications/new">
        <Button>Thêm mới</Button>
      </Link>

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
export default ListNotification;
