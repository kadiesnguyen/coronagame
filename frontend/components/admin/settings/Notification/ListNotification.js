import AdminSection from "@/components/admin/games/AdminSection";
import { adminDataGridBoxSx, adminDataGridSx } from "@/components/admin/games/adminDataGridSx";
import { ADMIN_LIST_NOTIFICATIONS_PAGE_SIZE } from "@/configs/notification.config";
import useGetCountAllNotification from "@/hooks/admin/useGetCountAllNotification";
import useGetListNotifications from "@/hooks/admin/useGetListNotifications";
import { resolveMediaUrl } from "@/utils/branding";
import { convertDateTime } from "@/utils/convertTime";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import BreadcrumbBar from "../../BreadcrumbBar";

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Quản lý thông báo", href: "/admin/settings/notifications" },
];

const DetailButton = ({ onClick }) => (
  <Tooltip title="Xem chi tiết" arrow>
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      size="small"
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        color: "#0b1528",
        backgroundColor: "#d4af37",
        border: "1px solid #e5c05b",
        "&:hover": { backgroundColor: "#e5c05b" },
      }}
    >
      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
    </IconButton>
  </Tooltip>
);

const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const NotifCard = ({ row, onOpen }) => (
  <Box
    onClick={onOpen}
    sx={{
      width: "100%",
      minWidth: 0,
      cursor: "pointer",
      borderRadius: "12px",
      padding: "12px",
      backgroundColor: "#101d33",
      border: "1px solid rgba(212,175,55,.25)",
      display: "flex",
      gap: "12px",
      "&:active": { backgroundColor: "rgba(212,175,55,.1)" },
    }}
  >
    {row.cover ? (
      <Box
        component="img"
        src={row.cover}
        alt=""
        sx={{
          width: 72,
          height: 56,
          objectFit: "cover",
          borderRadius: "8px",
          flexShrink: 0,
          backgroundColor: "#0b1528",
        }}
      />
    ) : (
      <Box
        sx={{
          width: 72,
          height: 56,
          borderRadius: "8px",
          flexShrink: 0,
          backgroundColor: "#0b1528",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      />
    )}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#fff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {row.tieuDe}
        </Typography>
        <DetailButton onClick={onOpen} />
      </Box>
      <Typography
        sx={{
          fontSize: "1.25rem",
          color: "#b8c0d4",
          mt: "4px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {row.noiDungText}
      </Typography>
      <Typography sx={{ fontSize: "1.15rem", color: "#8b95a8", mt: "6px" }}>{row.createdAt}</Typography>
    </Box>
  </Box>
);

const ListNotification = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_LIST_NOTIFICATIONS_PAGE_SIZE);
  const { data: dataQuery, isLoading } = useGetListNotifications({ page: page + 1, pageSize });
  const { data: rowCountState } = useGetCountAllNotification();

  const rows =
    dataQuery?.map((item, i) => ({
      id: item._id,
      stt: page * pageSize + i + 1,
      tieuDe: item.tieuDe,
      noiDung: item.noiDung,
      noiDungText: stripHtml(item.noiDung),
      hinhAnh: item.hinhAnh,
      cover: resolveMediaUrl(item.hinhAnh),
      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const columns = [
    { field: "stt", headerName: "STT", width: 56, sortable: false },
    {
      field: "hinhAnh",
      headerName: "Ảnh",
      width: 90,
      sortable: false,
      renderCell: (params) => {
        const src = resolveMediaUrl(params.value);
        if (!src) return null;
        return (
          <img src={src} alt="" style={{ width: 64, height: 40, objectFit: "cover", borderRadius: 6 }} />
        );
      },
    },
    { field: "tieuDe", headerName: "Tiêu đề", flex: 1.2, minWidth: 120 },
    {
      field: "noiDungText",
      headerName: "Nội dung",
      flex: 1.4,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "1.3rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={params.value}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "createdAt", headerName: "Thời gian", width: 140 },
    {
      field: "action",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <DetailButton onClick={() => router.push(`/admin/settings/notifications/${params.row.id}`)} />
      ),
    },
  ];

  const pageCount = Math.max(1, Math.ceil((rowCountState ?? 0) / pageSize));

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <AdminSection
        title="Danh sách thông báo"
        subtitle="Bấm dòng để xem / chỉnh sửa"
        sx={{ width: "100%", maxWidth: "120rem" }}
      >
        <Box sx={{ mb: "12px" }}>
          <Link href="/admin/settings/notifications/new">
            <Button sx={{ minHeight: 44 }}>Thêm mới</Button>
          </Link>
        </Box>

        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", minWidth: 0 }}>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress sx={{ color: "#e5c05b" }} size={28} />
              </Box>
            )}
            {!isLoading && rows.length === 0 && (
              <Typography sx={{ color: "#b8c0d4", textAlign: "center", py: 2 }}>Chưa có thông báo</Typography>
            )}
            {rows.map((row) => (
              <NotifCard
                key={row.id}
                row={row}
                onOpen={() => router.push(`/admin/settings/notifications/${row.id}`)}
              />
            ))}
            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Pagination
                  count={pageCount}
                  page={page + 1}
                  onChange={(_, p) => setPage(p - 1)}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": { color: "#fff", minWidth: 36, height: 36 },
                    "& .Mui-selected": { backgroundColor: "#d4af37 !important", color: "#0b1528" },
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ ...adminDataGridBoxSx, height: 520 }}>
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
              rows={rows}
              columns={columns}
              disableSelectionOnClick
              onRowClick={(params) => router.push(`/admin/settings/notifications/${params.row.id}`)}
              sx={{ ...adminDataGridSx, cursor: "pointer", "& .MuiDataGrid-row": { cursor: "pointer" } }}
            />
          </Box>
        )}
      </AdminSection>
    </>
  );
};

export default ListNotification;
