import { ADMIN_LIST_USER_PAGE_SIZE } from "@/configs/user.config";
import useGetCountAllUser from "@/hooks/admin/useGetCountAllUser";
import useGetListUsers from "@/hooks/admin/useGetListUsers";
import { convertJSXMoney } from "@/utils/convertMoney";
import convertTime, { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangUser, convertTinhTrangUser } from "@/utils/convertTinhTrang";
import CircleIcon from "@mui/icons-material/Circle";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminSection from "../games/AdminSection";
import { adminDataGridSx } from "../games/adminDataGridSx";
import BreadcrumbBar from "../BreadcrumbBar";
import BoxSearch from "./BoxSearch";
import QuickMoneyDialog from "./QuickMoneyDialog";

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Quản lý người dùng", href: "/admin/users" },
];

const OnlineDot = ({ online }) => (
  <Tooltip title={online ? "Đang online" : "Offline"} arrow>
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: online ? "rgba(46,204,113,.15)" : "rgba(255,255,255,.06)",
        border: `1px solid ${online ? "rgba(46,204,113,.45)" : "rgba(255,255,255,.12)"}`,
      }}
    >
      <CircleIcon sx={{ fontSize: 10, color: online ? "#2ecc71" : "#6b7280" }} />
    </Box>
  </Tooltip>
);

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

const actionBtnSx = (variant) => ({
  minHeight: 36,
  px: "10px",
  fontSize: "1.15rem",
  fontWeight: 700,
  whiteSpace: "nowrap",
  lineHeight: 1.2,
  borderRadius: "8px",
  textTransform: "none",
  ...(variant === "add"
    ? {
        color: "#0b1528",
        backgroundColor: "#2ecc71",
        "&:hover": { backgroundColor: "#58d68d" },
      }
    : {
        color: "#fff",
        backgroundColor: "#ef6d6d",
        "&:hover": { backgroundColor: "#f28b8b" },
      }),
});

const UserCard = ({ row, onOpen, onAddMoney, onSubMoney }) => (
  <Box
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
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minWidth: 0 }}>
      <Box
        onClick={onOpen}
        sx={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, cursor: "pointer", flex: 1 }}
      >
        <OnlineDot online={row.isOnline} />
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(212,175,55,.12)",
            color: "#e5c05b",
            flexShrink: 0,
          }}
        >
          <PersonOutlineIcon sx={{ fontSize: 20 }} />
        </Box>
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
            {row.taiKhoan}
          </Typography>
          <Typography sx={{ fontSize: "1.2rem", color: "#b8c0d4" }}>
            #{row.stt} · {row.role}
          </Typography>
        </Box>
      </Box>
      <DetailButton onClick={onOpen} />
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        minWidth: 0,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "1.1rem", color: "#8b95a8" }}>Số dư</Typography>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#e5c05b", wordBreak: "break-word" }}>
          {convertJSXMoney(row.money)}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0, textAlign: "right" }}>
        <Typography sx={{ fontSize: "1.1rem", color: "#8b95a8" }}>Tình trạng</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>{convertJSXTinhTrangUser(row.status)}</Box>
      </Box>
    </Box>

    <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Button size="small" sx={actionBtnSx("add")} onClick={onAddMoney}>
        Cộng tiền
      </Button>
      <Button size="small" sx={actionBtnSx("sub")} onClick={onSubMoney}>
        Trừ tiền
      </Button>
    </Box>
  </Box>
);

const Users = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { LIST_USERS_SOCKET } = useSelector((state) => state.admin);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_LIST_USER_PAGE_SIZE);
  const { data: dataQuery, isLoading, refetch } = useGetListUsers({ page: page + 1, pageSize, searchValue });
  const { data: rowCountState } = useGetCountAllUser({ searchValue });
  const [moneyDialog, setMoneyDialog] = useState({ open: false, mode: "add", user: null });

  const openMoneyDialog = (mode, user) => {
    setMoneyDialog({ open: true, mode, user });
  };

  const rows = useMemo(
    () =>
      dataQuery?.map((item, i) => {
        const isUserOnline = LIST_USERS_SOCKET.includes(item.taiKhoan);
        return {
          id: item._id,
          action: item._id,
          isOnline: isUserOnline,
          stt: page * pageSize + i + 1,
          taiKhoan: item.taiKhoan,
          money: item.money,
          role: item.role,
          status: item.status,
          createdAt: convertDateTime(item.createdAt),
          lastOnlineTime: isUserOnline
            ? "Đang hoạt động"
            : !item.lastOnlineTime
            ? convertTime(item.updatedAt)
            : convertTime(item.lastOnlineTime),
        };
      }) ?? [],
    [dataQuery, LIST_USERS_SOCKET, page, pageSize]
  );

  const pageCount = Math.max(1, Math.ceil((rowCountState ?? 0) / pageSize));

  const columns = useMemo(
    () => [
      {
        field: "stt",
        headerName: "#",
        width: 56,
        sortable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "taiKhoan",
        headerName: "Tài khoản",
        flex: 1.2,
        minWidth: 110,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, width: "100%" }}>
            <PersonOutlineIcon sx={{ fontSize: 18, color: "#e5c05b", flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "isOnline",
        headerName: "Online",
        width: 72,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => <OnlineDot online={!!params.value} />,
      },
      {
        field: "money",
        headerName: "Số dư",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 600, color: "#e5c05b" }}>
            {convertJSXMoney(params.value)}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Tình trạng",
        flex: 0.9,
        minWidth: 100,
        renderCell: (params) => convertJSXTinhTrangUser(params.row.status),
        valueGetter: (params) => convertTinhTrangUser(params.row.status),
      },
      {
        field: "thaoTac",
        headerName: "Thao tác",
        flex: 1.4,
        minWidth: 180,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <Button
              size="small"
              sx={actionBtnSx("add")}
              onClick={(e) => {
                e.stopPropagation();
                openMoneyDialog("add", params.row);
              }}
            >
              Cộng tiền
            </Button>
            <Button
              size="small"
              sx={actionBtnSx("sub")}
              onClick={(e) => {
                e.stopPropagation();
                openMoneyDialog("sub", params.row);
              }}
            >
              Trừ tiền
            </Button>
          </Box>
        ),
      },
      {
        field: "role",
        headerName: "Role",
        width: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "action",
        headerName: "",
        type: "actions",
        width: 64,
        getActions: (params) => [
          <DetailButton key="view" onClick={() => router.push(`/admin/users/${params.id}`)} />,
        ],
      },
    ],
    [router]
  );

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <AdminSection title="Danh sách người dùng" subtitle="Tìm kiếm · trạng thái online · chi tiết tài khoản">
        <BoxSearch searchValue={searchValue} setSearchValue={setSearchValue} />

        {isMobile ? (
          <Box sx={{ width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} sx={{ color: "#e5c05b" }} />
              </Box>
            )}
            {!isLoading && rows.length === 0 && (
              <Typography sx={{ color: "#b8c0d4", textAlign: "center", py: 3 }}>Không có người dùng</Typography>
            )}
            {!isLoading &&
              rows.map((row) => (
                <UserCard
                  key={row.id}
                  row={row}
                  onOpen={() => router.push(`/admin/users/${row.id}`)}
                  onAddMoney={() => openMoneyDialog("add", row)}
                  onSubMoney={() => openMoneyDialog("sub", row)}
                />
              ))}
            <Stack spacing={1} alignItems="center" sx={{ pt: 1 }}>
              <Typography sx={{ fontSize: "1.2rem", color: "#b8c0d4" }}>
                {rowCountState ?? 0} người dùng · trang {page + 1}/{pageCount}
              </Typography>
              <Pagination
                count={pageCount}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                color="primary"
                size="small"
                siblingCount={0}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#fff" },
                  "& .Mui-selected": { backgroundColor: "rgba(212,175,55,.35) !important" },
                }}
              />
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              height: 520,
              overflow: "hidden",
              "& .MuiDataGrid-root": { overflow: "hidden" },
              "& .MuiDataGrid-main": { overflow: "hidden" },
              "& .MuiDataGrid-virtualScroller": { overflowX: "hidden !important" },
              "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                outline: "none !important",
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
              rows={rows}
              columns={columns}
              disableColumnMenu
              disableSelectionOnClick
              sx={{
                ...adminDataGridSx,
                width: "100%",
                maxWidth: "100%",
                "& .MuiDataGrid-cell": {
                  ...adminDataGridSx["& .MuiDataGrid-cell"],
                  overflow: "hidden",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Box>
        )}
      </AdminSection>

      <QuickMoneyDialog
        open={moneyDialog.open}
        mode={moneyDialog.mode}
        user={moneyDialog.user}
        onClose={() => setMoneyDialog((s) => ({ ...s, open: false }))}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default Users;
