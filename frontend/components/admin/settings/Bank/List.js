import AdminSection from "@/components/admin/games/AdminSection";
import { adminDataGridBoxSx, adminDataGridSx } from "@/components/admin/games/adminDataGridSx";
import useGetListBank from "@/hooks/admin/useGetListBank";
import { convertJSXTinhTrangListBank } from "@/utils/convertTinhTrang";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/router";
import BreadcrumbBar from "../../BreadcrumbBar";

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Quản lý ngân hàng", href: "/admin/settings/bank" },
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

const BankCard = ({ row, onOpen }) => (
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
      flexDirection: "column",
      gap: "8px",
      "&:active": { backgroundColor: "rgba(212,175,55,.1)" },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        {row.image ? (
          <Box
            component="img"
            src={row.image}
            alt=""
            sx={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0, borderRadius: "8px", background: "#0b1528" }}
          />
        ) : null}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.shortName || row.tenBank}
          </Typography>
          <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>{row.code}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {convertJSXTinhTrangListBank(row.status)}
        <DetailButton onClick={onOpen} />
      </Box>
    </Box>
    <Typography sx={{ fontSize: "1.35rem", color: "#e5c05b", wordBreak: "break-word" }}>{row.soTaiKhoan}</Typography>
    <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4", wordBreak: "break-word" }}>{row.tenChuTaiKhoan}</Typography>
  </Box>
);

const List = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: dataQuery, isLoading } = useGetListBank();
  const router = useRouter();

  const rows =
    dataQuery?.map((item, i) => ({
      id: item._id,
      stt: i + 1,
      tenBank: item.tenBank,
      shortName: item.shortName,
      code: item.code,
      tenChuTaiKhoan: item.tenChuTaiKhoan,
      soTaiKhoan: item.soTaiKhoan,
      image: item.image,
      status: item.status,
    })) ?? [];

  const columns = [
    { field: "stt", headerName: "STT", width: 56, sortable: false },
    {
      field: "image",
      headerName: "Ảnh",
      width: 64,
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <img src={params.value} alt="" style={{ width: "3.2rem", height: "3.2rem", objectFit: "contain" }} />
        ) : null,
    },
    { field: "shortName", headerName: "Tên tắt", flex: 0.8, minWidth: 80 },
    { field: "tenBank", headerName: "Ngân hàng", flex: 1.2, minWidth: 100 },
    {
      field: "soTaiKhoan",
      headerName: "STK",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "1.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "tenChuTaiKhoan",
      headerName: "Chủ TK",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontSize: "1.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "TT",
      width: 100,
      renderCell: (params) => convertJSXTinhTrangListBank(params.value),
    },
    {
      field: "action",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <DetailButton onClick={() => router.push(`/admin/settings/bank/${params.row.id}`)} />
      ),
    },
  ];

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <AdminSection
        title="Danh sách ngân hàng"
        subtitle="Tài khoản nhận nạp tiền · Bấm dòng để xem chi tiết"
        sx={{ width: "100%", maxWidth: "120rem" }}
      >
        <Box sx={{ mb: "12px" }}>
          <Link href="/admin/settings/bank/new">
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
              <Typography sx={{ color: "#b8c0d4", textAlign: "center", py: 2 }}>Chưa có ngân hàng</Typography>
            )}
            {rows.map((row) => (
              <BankCard key={row.id} row={row} onOpen={() => router.push(`/admin/settings/bank/${row.id}`)} />
            ))}
          </Box>
        ) : (
          <Box sx={{ ...adminDataGridBoxSx, height: 520 }}>
            <DataGrid
              loading={isLoading}
              rows={rows}
              columns={columns}
              disableSelectionOnClick
              onRowClick={(params) => router.push(`/admin/settings/bank/${params.row.id}`)}
              sx={{ ...adminDataGridSx, cursor: "pointer", "& .MuiDataGrid-row": { cursor: "pointer" } }}
            />
          </Box>
        )}
      </AdminSection>
    </>
  );
};

export default List;
