import useGetListAdmins from "@/hooks/admin/useGetListAdmins";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangUser } from "@/utils/convertTinhTrang";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, CircularProgress, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useMemo } from "react";
import BreadcrumbBar from "../BreadcrumbBar";
import AdminSection from "../games/AdminSection";
import { adminDataGridSx } from "../games/adminDataGridSx";

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Cài đặt", href: "/admin/settings" },
  { title: "Danh sách quản trị", href: "/admin/settings/admins" },
];

const DetailButton = ({ onClick }) => (
  <Tooltip title="Xem chi tiết" arrow>
    <IconButton
      onClick={onClick}
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

const AdminCard = ({ row, onOpen }) => (
  <Box
    onClick={onOpen}
    sx={{
      width: "100%",
      minWidth: 0,
      borderRadius: "12px",
      padding: "12px",
      backgroundColor: "#101d33",
      border: "1px solid rgba(212,175,55,.25)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      cursor: "pointer",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e5c05b",
          backgroundColor: "#0b1528",
          border: "1px solid rgba(212,175,55,.4)",
        }}
      >
        <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#fff", lineHeight: 1.2 }} noWrap>
          {row.taiKhoan}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", color: "#b8c0d4" }}>{convertJSXMoney(row.money)}</Typography>
      </Box>
      {convertJSXTinhTrangUser(row.status)}
    </Box>
    <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Tạo: {convertDateTime(row.createdAt)}</Typography>
  </Box>
);

const ListAdmins = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data, isLoading } = useGetListAdmins();

  const rows = useMemo(
    () =>
      (data || []).map((item) => ({
        id: item._id,
        taiKhoan: item.taiKhoan,
        money: item.money,
        status: item.status,
        createdAt: item.createdAt,
        role: item.role,
      })),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        field: "taiKhoan",
        headerName: "Tài khoản",
        flex: 1.2,
        minWidth: 140,
      },
      {
        field: "money",
        headerName: "Số dư",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => convertJSXMoney(params.value),
      },
      {
        field: "status",
        headerName: "Trạng thái",
        flex: 0.8,
        minWidth: 110,
        renderCell: (params) => convertJSXTinhTrangUser(params.value),
      },
      {
        field: "createdAt",
        headerName: "Ngày tạo",
        flex: 1.1,
        minWidth: 150,
        renderCell: (params) => convertDateTime(params.value),
      },
      {
        field: "actions",
        headerName: "",
        width: 64,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <DetailButton onClick={() => router.push(`/admin/users/${params.row.id}`)} />
        ),
      },
    ],
    [router]
  );

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <Box sx={{ mb: "8px" }}>
        <Typography
          sx={{
            fontSize: { xs: "2.2rem", md: "2.6rem" },
            fontWeight: 800,
            color: "#e5c05b",
            lineHeight: 1.2,
          }}
        >
          Danh sách quản trị
        </Typography>
        <Typography sx={{ fontSize: "1.35rem", color: "#b8c0d4", mt: "4px" }}>
          Các tài khoản có quyền admin
        </Typography>
      </Box>

      <AdminSection title="Quản trị viên" subtitle={`${rows.length} tài khoản`}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: "32px" }}>
            <CircularProgress size={36} sx={{ color: "#d4af37" }} />
          </Box>
        ) : isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rows.length === 0 ? (
              <Typography sx={{ color: "#b8c0d4", textAlign: "center", py: "24px" }}>Chưa có quản trị viên</Typography>
            ) : (
              rows.map((row) => (
                <AdminCard key={row.id} row={row} onOpen={() => router.push(`/admin/users/${row.id}`)} />
              ))
            )}
          </Box>
        ) : (
          <Box sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              hideFooter
              disableSelectionOnClick
              sx={adminDataGridSx}
              localeText={{ noRowsLabel: "Chưa có quản trị viên" }}
            />
          </Box>
        )}
      </AdminSection>
    </>
  );
};

export default ListAdmins;
