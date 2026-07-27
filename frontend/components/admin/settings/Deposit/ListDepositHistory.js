import AdminSection from "@/components/admin/games/AdminSection";
import { adminDataGridBoxSx, adminDataGridSx } from "@/components/admin/games/adminDataGridSx";
import OutlinedInput from "@/components/input/OutlinedInput";
import { ADMIN_LIST_DEPOSIT_HISTORY_PAGE_SIZE, TINH_TRANG_DEPOSIT_HISTORY } from "@/configs/deposit.config";
import useGetCountAllDepositHistory from "@/hooks/admin/useGetCountAllDepositHistory";
import useGetListDepositHistory from "@/hooks/admin/useGetListDepositHistory";
import DepositService from "@/services/admin/DepositService";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangDepositHistory, convertTinhTrangDepositHistory } from "@/utils/convertTinhTrang";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { toast } from "@/utils/toast";

const InfoButton = ({ onClick }) => (
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

const DepositCard = ({ row, onOpen, onInfo }) => {
  const pending = row.tinhTrang === TINH_TRANG_DEPOSIT_HISTORY.DANG_CHO;
  return (
    <Box
      onClick={onOpen}
      sx={{
        width: "100%",
        minWidth: 0,
        cursor: "pointer",
        borderRadius: "12px",
        padding: "12px",
        backgroundColor: "#101d33",
        border: pending ? "1px solid rgba(212,175,55,.45)" : "1px solid rgba(255,255,255,.08)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        "&:active": { backgroundColor: "rgba(212,175,55,.1)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minWidth: 0 }}>
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
          {row.taiKhoan}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {convertJSXTinhTrangDepositHistory(row.tinhTrang)}
          <InfoButton onClick={onInfo} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#e5c05b" }}>
        {convertJSXMoney(row.soTien)}
      </Typography>
      <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4", wordBreak: "break-word" }}>{row.nganHang}</Typography>
      <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>{row.createdAt}</Typography>
      {pending && (
        <Typography sx={{ fontSize: "1.2rem", color: "#e5c05b" }}>Bấm để duyệt / từ chối</Typography>
      )}
    </Box>
  );
};

const ListDeposit = ({ userId = "", statusGroup = "" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ADMIN_LIST_DEPOSIT_HISTORY_PAGE_SIZE);
  const { data: dataQuery, isLoading, refetch } = useGetListDepositHistory({
    page: page + 1,
    pageSize,
    userId,
    statusGroup,
  });
  const { data: rowCountState, refetch: refetchCount } = useGetCountAllDepositHistory({ userId, statusGroup });
  const sectionTitle =
    statusGroup === "pending" ? "Yêu cầu nạp" : statusGroup === "history" ? "Lịch sử nạp" : "Lịch sử nạp tiền";
  const isHistoryMode = statusGroup === "history";
  const sectionSubtitle = isHistoryMode
    ? "Bấm dòng để xem chi tiết (chỉ xem)"
    : isMobile
    ? "Bấm thẻ để duyệt / từ chối"
    : "Bấm dòng để duyệt / từ chối";
  const emptyText = statusGroup === "pending" ? "Không có yêu cầu nạp đang chờ duyệt" : "Không có lịch sử nạp tiền";

  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [noiDung, setNoiDung] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openReview = (item) => {
    if (!item) return;
    setSelected(item);
    setNoiDung(item.noiDung || "");
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelected(null);
  };

  const handleUpdate = async (tinhTrang) => {
    if (!selected?._id) return;
    try {
      setIsSaving(true);
      const results = await DepositService.editDetailedDepositHistory({
        id: selected._id,
        noiDung:
          noiDung ||
          (tinhTrang === TINH_TRANG_DEPOSIT_HISTORY.HOAN_TAT
            ? "Đã duyệt nạp tiền"
            : tinhTrang === TINH_TRANG_DEPOSIT_HISTORY.DA_HUY
              ? "Từ chối nạp tiền"
              : ""),
        tinhTrang,
      });
      toast.success(results?.data?.message ?? "Cập nhật thành công");
      closeDialog();
      refetch();
      refetchCount();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật");
    } finally {
      setIsSaving(false);
    }
  };

  const rows =
    dataQuery?.map((item, i) => ({
      id: item._id,
      stt: page * pageSize + i + 1,
      taiKhoan: item.nguoiDung?.taiKhoan ?? "",
      noiDung: item.noiDung ?? "",
      soTien: item.soTien,
      tinhTrang: item.tinhTrang,
      nganHang: `${item.nganHang?.shortName || item.nganHang?.tenNganHang || ""} - ${item.nganHang?.soTaiKhoan || ""} - ${item.nganHang?.tenChuTaiKhoan || ""}`,
      createdAt: convertDateTime(item.createdAt),
      raw: item,
    })) ?? [];

  const columns = [
    { field: "stt", headerName: "STT", width: 64, sortable: false },
    { field: "taiKhoan", headerName: "Tài khoản", flex: 1, minWidth: 100 },
    {
      field: "soTien",
      headerName: "Số tiền",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => convertJSXMoney(params.value),
    },
    {
      field: "nganHang",
      headerName: "Ngân hàng",
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
    {
      field: "tinhTrang",
      headerName: "Tình trạng",
      width: 120,
      renderCell: (params) => convertJSXTinhTrangDepositHistory(params.row.tinhTrang),
      valueGetter: (params) => convertTinhTrangDepositHistory(params.row.tinhTrang),
    },
    { field: "createdAt", headerName: "Thời gian", width: 140 },
    {
      field: "action",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params) => <InfoButton onClick={() => openReview(params.row.raw)} />,
    },
  ];

  const isPending = selected?.tinhTrang === TINH_TRANG_DEPOSIT_HISTORY.DANG_CHO;
  const pageCount = Math.max(1, Math.ceil((rowCountState ?? 0) / pageSize));

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isSaving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <AdminSection title={sectionTitle} subtitle={sectionSubtitle}>
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", minWidth: 0 }}>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress sx={{ color: "#e5c05b" }} size={28} />
              </Box>
            )}
            {!isLoading && rows.length === 0 && (
              <Typography sx={{ color: "#b8c0d4", fontSize: "1.4rem", textAlign: "center", py: 2 }}>
                {emptyText}
              </Typography>
            )}
            {rows.map((row) => (
              <DepositCard
                key={row.id}
                row={row}
                onOpen={() => openReview(row.raw)}
                onInfo={() => openReview(row.raw)}
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
              onRowClick={(params) => openReview(params.row.raw)}
              sx={{
                ...adminDataGridSx,
                cursor: "pointer",
                "& .MuiDataGrid-row": { cursor: "pointer" },
              }}
            />
          </Box>
        )}
      </AdminSection>

      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#162948",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(212,175,55,.35)",
            m: { xs: "12px", sm: 2 },
            width: { xs: "calc(100% - 24px)", sm: "100%" },
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#e5c05b",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          {isPending ? "Duyệt yêu cầu nạp tiền" : "Chi tiết nạp tiền"}
          <IconButton onClick={closeDialog} sx={{ color: "#b8c0d4" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "12px", pt: "8px !important" }}>
          {selected && (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: "12px",
                }}
              >
                <Box sx={{ p: "12px", borderRadius: "12px", backgroundColor: "#101d33", border: "1px solid rgba(255,255,255,.08)" }}>
                  <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Tài khoản</Typography>
                  <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, wordBreak: "break-word" }}>
                    {selected?.nguoiDung?.taiKhoan}
                  </Typography>
                </Box>
                <Box sx={{ p: "12px", borderRadius: "12px", backgroundColor: "#101d33", border: "1px solid rgba(255,255,255,.08)" }}>
                  <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Số tiền</Typography>
                  <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#e5c05b" }}>
                    {convertJSXMoney(selected.soTien)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ p: "12px", borderRadius: "12px", backgroundColor: "#101d33", border: "1px solid rgba(255,255,255,.08)" }}>
                <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Ngân hàng nhận</Typography>
                <Typography sx={{ fontSize: "1.4rem", fontWeight: 600, wordBreak: "break-word" }}>
                  {selected?.nganHang?.shortName || selected?.nganHang?.tenNganHang}
                </Typography>
                <Typography sx={{ fontSize: "1.4rem", color: "#e5c05b", wordBreak: "break-word" }}>
                  {selected?.nganHang?.soTaiKhoan}
                </Typography>
                <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4", wordBreak: "break-word" }}>
                  {selected?.nganHang?.tenChuTaiKhoan}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4" }}>
                Thời gian: {convertDateTime(selected.createdAt)} · Trạng thái:{" "}
                {convertTinhTrangDepositHistory(selected.tinhTrang)}
              </Typography>
              <FormControl fullWidth>
                <Typography sx={{ mb: 0.5 }}>Nội dung phản hồi</Typography>
                <OutlinedInput
                  size="small"
                  fullWidth
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  placeholder="Nội dung"
                  disabled={!isPending}
                />
              </FormControl>
              {isPending && (
                <Typography sx={{ fontSize: "1.2rem", color: "#ef6d6d" }}>
                  Duyệt = tự động cộng tiền cho user. Từ chối = không cộng tiền.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            gap: 1,
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Button variant="outlined" onClick={closeDialog} sx={{ minHeight: 44 }}>
            Đóng
          </Button>
          {isPending && (
            <>
              <Button
                onClick={() => handleUpdate(TINH_TRANG_DEPOSIT_HISTORY.DA_HUY)}
                startIcon={<HighlightOffIcon />}
                sx={{
                  minHeight: 44,
                  backgroundColor: "rgba(239,109,109,.15)",
                  color: "#ef6d6d",
                  border: "1px solid rgba(239,109,109,.45)",
                  "&:hover": { backgroundColor: "rgba(239,109,109,.28)" },
                }}
              >
                Từ chối
              </Button>
              <Button
                onClick={() => handleUpdate(TINH_TRANG_DEPOSIT_HISTORY.HOAN_TAT)}
                startIcon={<CheckCircleOutlineIcon />}
                sx={{
                  minHeight: 44,
                  backgroundColor: "#d4af37",
                  color: "#0b1528",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#e5c05b" },
                }}
              >
                Duyệt
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListDeposit;
