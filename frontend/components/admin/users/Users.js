import { ADMIN_LIST_USER_PAGE_SIZE, TINH_TRANG_USER } from "@/configs/user.config";
import useGetCountAllUser from "@/hooks/admin/useGetCountAllUser";
import useGetListUsers from "@/hooks/admin/useGetListUsers";
import UserService from "@/services/admin/UserService";
import { convertJSXMoney } from "@/utils/convertMoney";
import convertTime, { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangUser, convertTinhTrangUser } from "@/utils/convertTinhTrang";
import { toast } from "@/utils/toast";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const STATUS_OPTIONS = [
  { value: TINH_TRANG_USER.TRUE, label: "Đang sử dụng" },
  { value: TINH_TRANG_USER.FALSE, label: "Khóa" },
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

const UserCard = ({ row, selected, onToggleSelect, onOpen, onAddMoney, onSubMoney, onStatusClick }) => (
  <Box
    sx={{
      width: "100%",
      minWidth: 0,
      borderRadius: "12px",
      padding: "12px",
      backgroundColor: "#101d33",
      border: selected ? "1px solid #e5c05b" : "1px solid rgba(212,175,55,.25)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
        <Checkbox
          checked={selected}
          onChange={onToggleSelect}
          sx={{ p: "4px", color: "#8b95a8", "&.Mui-checked": { color: "#e5c05b" } }}
        />
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
      </Box>
      <DetailButton onClick={onOpen} />
    </Box>

    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", minWidth: 0 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "1.1rem", color: "#8b95a8" }}>Số dư</Typography>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#e5c05b", wordBreak: "break-word" }}>
          {convertJSXMoney(row.money)}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0, textAlign: "right" }}>
        <Typography sx={{ fontSize: "1.1rem", color: "#8b95a8" }}>Tình trạng</Typography>
        <Box
          onClick={onStatusClick}
          sx={{ display: "inline-flex", justifyContent: "flex-end", cursor: "pointer", ml: "auto" }}
        >
          {convertJSXTinhTrangUser(row.status)}
        </Box>
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
  const { data: rowCountState, refetch: refetchCount } = useGetCountAllUser({ searchValue });
  const [moneyDialog, setMoneyDialog] = useState({ open: false, mode: "add", user: null });
  const [selectionModel, setSelectionModel] = useState([]);
  const [statusDialog, setStatusDialog] = useState({ open: false, user: null, saving: false });
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
  const selectedCount = selectionModel.length;

  const handleChangeStatus = async (nextStatus) => {
    const user = statusDialog.user;
    if (!user) return;
    try {
      setStatusDialog((s) => ({ ...s, saving: true }));
      await UserService.updateInformationUser({
        userId: user.id,
        role: user.role,
        status: nextStatus,
      });
      toast.success(nextStatus ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
      setStatusDialog({ open: false, user: null, saving: false });
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Cập nhật trạng thái thất bại");
      setStatusDialog((s) => ({ ...s, saving: false }));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedCount) return;
    try {
      setDeleteBusy(true);
      const res = await UserService.deleteUsers({ userIds: selectionModel });
      toast.success(res?.data?.message ?? `Đã xóa ${selectedCount} tài khoản`);
      setSelectionModel([]);
      setConfirmDeleteOpen(false);
      refetch();
      refetchCount?.();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Xóa tài khoản thất bại");
    } finally {
      setDeleteBusy(false);
    }
  };

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
        minWidth: 110,
        renderCell: (params) => (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setStatusDialog({ open: true, user: params.row, saving: false });
            }}
            sx={{ cursor: "pointer", display: "inline-flex" }}
          >
            {convertJSXTinhTrangUser(params.row.status)}
          </Box>
        ),
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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            mb: selectedCount > 0 ? "12px" : 0,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <BoxSearch searchValue={searchValue} setSearchValue={setSearchValue} />
          </Box>
          {selectedCount > 0 && (
            <Button
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={deleteBusy}
              sx={{
                minHeight: 44,
                px: "16px",
                fontWeight: 800,
                fontSize: "1.35rem",
                color: "#fff",
                backgroundColor: "#ef6d6d",
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "#f28b8b" },
              }}
            >
              Xóa tài khoản ({selectedCount})
            </Button>
          )}
        </Box>

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
                  selected={selectionModel.includes(row.id)}
                  onToggleSelect={() =>
                    setSelectionModel((prev) =>
                      prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
                    )
                  }
                  onOpen={() => router.push(`/admin/users/${row.id}`)}
                  onAddMoney={() => openMoneyDialog("add", row)}
                  onSubMoney={() => openMoneyDialog("sub", row)}
                  onStatusClick={() => setStatusDialog({ open: true, user: row, saving: false })}
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
              checkboxSelection
              selectionModel={selectionModel}
              onSelectionModelChange={(ids) => setSelectionModel(ids)}
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
                "& .MuiCheckbox-root": { color: "#8b95a8" },
                "& .Mui-checked": { color: "#e5c05b !important" },
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

      <Dialog
        open={statusDialog.open}
        onClose={() => !statusDialog.saving && setStatusDialog({ open: false, user: null, saving: false })}
        PaperProps={{
          sx: {
            backgroundColor: "#101d33",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(212,175,55,.35)",
            minWidth: { xs: "90vw", sm: 360 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#e5c05b", fontSize: "1.7rem" }}>
          Đổi tình trạng · {statusDialog.user?.taiKhoan}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "12px", pt: "8px !important" }}>
          {STATUS_OPTIONS.map((opt) => {
            const active = statusDialog.user?.status === opt.value;
            return (
              <Button
                key={String(opt.value)}
                disabled={statusDialog.saving}
                onClick={() => handleChangeStatus(opt.value)}
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  borderRadius: "12px",
                  color: active ? "#0b1528" : "#fff",
                  backgroundColor: active ? (opt.value ? "#7fd7b0" : "#ef6d6d") : "#0b1528",
                  border: `1px solid ${opt.value ? "#7fd7b0" : "#ef6d6d"}`,
                  "&:hover": {
                    backgroundColor: opt.value ? "#7fd7b0" : "#ef6d6d",
                    color: "#0b1528",
                  },
                }}
              >
                {opt.label}
              </Button>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ px: "16px", pb: "16px" }}>
          <Button
            disabled={statusDialog.saving}
            onClick={() => setStatusDialog({ open: false, user: null, saving: false })}
            sx={{ color: "#b8c0d4" }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => !deleteBusy && setConfirmDeleteOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#101d33",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(239,109,109,.45)",
            minWidth: { xs: "90vw", sm: 360 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#ef6d6d", fontSize: "1.7rem" }}>Xóa tài khoản?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "1.4rem", color: "#b8c0d4" }}>
            Xóa vĩnh viễn {selectedCount} tài khoản đã chọn. Không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: "16px", pb: "16px", gap: "8px" }}>
          <Button disabled={deleteBusy} onClick={() => setConfirmDeleteOpen(false)} sx={{ color: "#b8c0d4" }}>
            Hủy
          </Button>
          <Button
            disabled={deleteBusy}
            onClick={handleDeleteSelected}
            sx={{
              minHeight: 44,
              px: "16px",
              fontWeight: 800,
              color: "#fff",
              backgroundColor: "#ef6d6d",
              "&:hover": { backgroundColor: "#f28b8b" },
            }}
          >
            {deleteBusy ? "Đang xóa..." : "Xóa tài khoản"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Users;
