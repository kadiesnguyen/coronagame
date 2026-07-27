import AdminSection from "@/components/admin/games/AdminSection";
import OutlinedInput from "@/components/input/OutlinedInput";
import useGetListUserBank from "@/hooks/admin/useGetListUserBank";
import UserService from "@/services/admin/UserService";
import { convertDateTime } from "@/utils/convertTime";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { toast } from "@/utils/toast";

const ListUserBank = ({ ID }) => {
  const { data: dataQuery, isLoading, refetch } = useGetListUserBank({ userId: ID });
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [bankForm, setBankForm] = useState({
    tenNganHang: "",
    tenChuTaiKhoan: "",
    soTaiKhoan: "",
    bankCode: "",
  });

  const openEdit = (item) => {
    setEditingId(item._id);
    setBankForm({
      tenNganHang: item.tenNganHang || "",
      tenChuTaiKhoan: item.tenChuTaiKhoan || "",
      soTaiKhoan: item.soTaiKhoan || "",
      bankCode: item.bankCode || "",
    });
    setOpenBankDialog(true);
  };

  const handleUpdateBank = async () => {
    try {
      if (!bankForm.tenNganHang.trim() || !bankForm.tenChuTaiKhoan.trim() || !bankForm.soTaiKhoan.trim()) {
        toast.error("Vui lòng nhập đầy đủ thông tin ngân hàng");
        return;
      }
      setIsSaving(true);
      const results = await UserService.updateUserBank({
        id: editingId,
        ...bankForm,
      });
      toast.success(results?.data?.message ?? "Cập nhật ngân hàng thành công");
      setOpenBankDialog(false);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật ngân hàng");
    } finally {
      setIsSaving(false);
    }
  };

  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      stt: i + 1,
      tenNganHang: item.tenNganHang,
      soTaiKhoan: item.soTaiKhoan,
      tenChuTaiKhoan: item.tenChuTaiKhoan,
      createdAt: convertDateTime(item.createdAt),
      raw: item,
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 70 },
    { field: "tenNganHang", headerName: "Tên ngân hàng", flex: 1, minWidth: 120 },
    { field: "soTaiKhoan", headerName: "STK", flex: 1, minWidth: 120 },
    { field: "tenChuTaiKhoan", headerName: "Chủ tài khoản", flex: 1, minWidth: 120 },
    { field: "createdAt", headerName: "Thời gian tạo", width: 160 },
    {
      field: "action",
      headerName: "Sửa",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Đổi tài khoản ngân hàng" arrow>
          <IconButton
            onClick={() => openEdit(params.row.raw)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              backgroundColor: "#d4af37",
              color: "#0b1528",
              "&:hover": { backgroundColor: "#e5c05b" },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isSaving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <AdminSection title="Danh sách ngân hàng" subtitle="Bấm icon sửa để đổi STK / ngân hàng / chủ tài khoản">
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            height: { xs: 360, md: 420 },
            overflow: "hidden",
          }}
        >
          <DataGrid
            loading={isLoading}
            rows={GridRowsProp}
            columns={GridColDef}
            disableSelectionOnClick
            sx={{
              color: "#ffffff",
              border: "none",
              "& .MuiDataGrid-cell": { borderColor: "rgba(255,255,255,.08)" },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#101d33",
                borderColor: "rgba(255,255,255,.08)",
              },
              "& .MuiToolbar-root": { color: "#ffffff" },
            }}
          />
        </Box>
      </AdminSection>

      <Dialog
        open={openBankDialog}
        onClose={() => setOpenBankDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#162948",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(212,175,55,.35)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#e5c05b", fontWeight: 700 }}>Đổi tài khoản ngân hàng</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "12px", pt: "8px !important" }}>
          <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4" }}>
            Lệnh rút đang chờ dùng STK này sẽ nhận theo thông tin mới sau khi cập nhật.
          </Typography>
          <FormControl fullWidth>
            <Typography sx={{ mb: 0.5 }}>Tên ngân hàng</Typography>
            <OutlinedInput
              size="small"
              value={bankForm.tenNganHang}
              onChange={(e) => setBankForm((s) => ({ ...s, tenNganHang: e.target.value }))}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography sx={{ mb: 0.5 }}>Số tài khoản</Typography>
            <OutlinedInput
              size="small"
              value={bankForm.soTaiKhoan}
              onChange={(e) => setBankForm((s) => ({ ...s, soTaiKhoan: e.target.value }))}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography sx={{ mb: 0.5 }}>Tên chủ tài khoản</Typography>
            <OutlinedInput
              size="small"
              value={bankForm.tenChuTaiKhoan}
              onChange={(e) => setBankForm((s) => ({ ...s, tenChuTaiKhoan: e.target.value }))}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography sx={{ mb: 0.5 }}>Bank code (tuỳ chọn)</Typography>
            <OutlinedInput
              size="small"
              value={bankForm.bankCode}
              onChange={(e) => setBankForm((s) => ({ ...s, bankCode: e.target.value }))}
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenBankDialog(false)}>
            Huỷ
          </Button>
          <Button
            onClick={handleUpdateBank}
            sx={{ backgroundColor: "#d4af37", color: "#0b1528", "&:hover": { backgroundColor: "#e5c05b" } }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ListUserBank;
