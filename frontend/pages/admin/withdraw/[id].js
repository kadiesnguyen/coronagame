import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import AdminSection from "@/components/admin/games/AdminSection";
import OutlinedInput from "@/components/input/OutlinedInput";
import { TINH_TRANG_WITHDRAW_HISTORY } from "@/configs/withdraw.config";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import useGetDetailedWithdrawHistory from "@/hooks/admin/useGetDetailedWithdrawHistory";
import WithdrawService from "@/services/admin/WithdrawService";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertTinhTrangWithdrawHistory } from "@/utils/convertTinhTrang";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
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
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { toast } from "@/utils/toast";

const ChiTiet = ({ ID }) => {
  const { data: dataQuery, isLoading, refetch } = useGetDetailedWithdrawHistory({ id: ID });
  const [noiDung, setNoiDung] = useState("");
  const [tinhTrang, setTinhTrang] = useState(TINH_TRANG_WITHDRAW_HISTORY.DANG_CHO);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [bankForm, setBankForm] = useState({
    tenNganHang: "",
    tenChuTaiKhoan: "",
    soTaiKhoan: "",
    bankCode: "",
  });

  const isPending = dataQuery?.tinhTrang === TINH_TRANG_WITHDRAW_HISTORY.DANG_CHO;
  const BreadcrumbData = [
    { title: "Admin", href: "/admin" },
    {
      title: isPending ? "Yêu cầu rút tiền" : "Lịch sử rút",
      href: isPending ? "/admin/withdraw" : "/admin/withdraw/history",
    },
    { title: "Chi tiết", href: "/admin/withdraw/" + ID },
  ];

  useEffect(() => {
    if (dataQuery) {
      setTinhTrang(dataQuery.tinhTrang);
      setNoiDung(dataQuery.noiDung || "");
      setBankForm({
        tenNganHang: dataQuery?.nganHang?.tenNganHang || "",
        tenChuTaiKhoan: dataQuery?.nganHang?.tenChuTaiKhoan || "",
        soTaiKhoan: dataQuery?.nganHang?.soTaiKhoan || "",
        bankCode: dataQuery?.nganHang?.bankCode || "",
      });
    }
  }, [dataQuery]);

  const handleSaveStatus = async () => {
    try {
      setIsLoadingUpdate(true);
      const results = await WithdrawService.editDetailedWithdrawHistory({
        id: ID,
        noiDung,
        tinhTrang,
      });
      toast.success(results?.data?.message ?? "Cập nhật thành công");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoadingUpdate(true);
      const results = await WithdrawService.editDetailedWithdrawHistory({
        id: ID,
        noiDung: noiDung || "Đã duyệt chuyển khoản",
        tinhTrang: TINH_TRANG_WITHDRAW_HISTORY.HOAN_TAT,
      });
      toast.success(results?.data?.message ?? "Duyệt lệnh thành công");
      setTinhTrang(TINH_TRANG_WITHDRAW_HISTORY.HOAN_TAT);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi duyệt lệnh");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleUpdateBank = async () => {
    try {
      if (!bankForm.tenNganHang.trim() || !bankForm.tenChuTaiKhoan.trim() || !bankForm.soTaiKhoan.trim()) {
        toast.error("Vui lòng nhập đầy đủ thông tin ngân hàng");
        return;
      }
      setIsLoadingUpdate(true);
      const results = await WithdrawService.updateWithdrawBank({
        id: ID,
        ...bankForm,
      });
      toast.success(results?.data?.message ?? "Cập nhật ngân hàng thành công");
      setOpenBankDialog(false);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật ngân hàng");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const LIST_STATUS_WITHDRAW = Object.values(TINH_TRANG_WITHDRAW_HISTORY).map((value) => ({
    ten: convertTinhTrangWithdrawHistory(value),
    value,
  }));

  return (
    <>
      <NextSeo title="Chi tiết yêu cầu rút tiền" />
      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoadingUpdate || isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BreadcrumbBar data={BreadcrumbData} />

        <Box sx={{ width: "100%", maxWidth: "72rem", display: "flex", flexDirection: "column", gap: "16px" }}>
          <AdminSection
            title={isPending ? "Chi tiết yêu cầu rút tiền" : "Chi tiết lịch sử rút"}
            subtitle={isPending ? "Đổi STK nếu sai → Cập nhật → Duyệt lệnh" : "Đơn đã xử lý — chỉ xem"}
          >
            {!isLoading && dataQuery && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", minWidth: 0 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: "12px",
                  }}
                >
                  <Box sx={{ p: "12px", borderRadius: "12px", backgroundColor: "#101d33", border: "1px solid rgba(255,255,255,.08)" }}>
                    <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Tài khoản</Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff" }}>
                      {dataQuery?.nguoiDung?.taiKhoan}
                    </Typography>
                  </Box>
                  <Box sx={{ p: "12px", borderRadius: "12px", backgroundColor: "#101d33", border: "1px solid rgba(255,255,255,.08)" }}>
                    <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Số tiền rút</Typography>
                    <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#e5c05b" }}>
                      {convertJSXMoney(dataQuery?.soTien)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: "14px",
                    borderRadius: "12px",
                    backgroundColor: "#101d33",
                    border: "1px solid rgba(212,175,55,.3)",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    minWidth: 0,
                  }}
                >
                  <Box sx={{ display: "flex", gap: "12px", minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: "rgba(212,175,55,.12)",
                        color: "#e5c05b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AccountBalanceIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8" }}>Tài khoản nhận tiền</Typography>
                      <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", wordBreak: "break-word" }}>
                        {dataQuery?.nganHang?.tenNganHang}
                      </Typography>
                      <Typography sx={{ fontSize: "1.4rem", color: "#e5c05b", wordBreak: "break-word" }}>
                        {dataQuery?.nganHang?.soTaiKhoan}
                      </Typography>
                      <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4", wordBreak: "break-word" }}>
                        {dataQuery?.nganHang?.tenChuTaiKhoan}
                      </Typography>
                    </Box>
                  </Box>
                  {isPending && (
                    <Tooltip title="Đổi tài khoản ngân hàng" arrow>
                      <IconButton
                        onClick={() => setOpenBankDialog(true)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "10px",
                          backgroundColor: "#d4af37",
                          color: "#0b1528",
                          "&:hover": { backgroundColor: "#e5c05b" },
                        }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <FormControl fullWidth>
                  <Typography sx={{ mb: 0.5 }}>Nội dung phản hồi</Typography>
                  <OutlinedInput
                    placeholder="Nội dung"
                    onChange={(e) => setNoiDung(e.target.value)}
                    size="small"
                    type="text"
                    fullWidth
                    value={noiDung}
                    disabled={!isPending}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <Typography sx={{ mb: 0.5 }}>Tình trạng</Typography>
                  {isPending ? (
                    <>
                      <Typography sx={{ color: "#ef6d6d", fontSize: "1.2rem", mb: 1 }}>
                        Đổi từ &quot;đang chờ&quot; → &quot;đã hủy&quot; sẽ hoàn tiền cho user
                      </Typography>
                      <Select
                        labelId="select-status"
                        id="select-status-option"
                        label="Status"
                        input={<OptionMenu />}
                        value={tinhTrang}
                        onChange={(e) => setTinhTrang(e.target.value)}
                      >
                        {LIST_STATUS_WITHDRAW.map((item) => (
                          <OptionMenuItem key={item.value} value={item.value}>
                            {item.ten}
                          </OptionMenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <OutlinedInput
                      size="small"
                      type="text"
                      fullWidth
                      value={convertTinhTrangWithdrawHistory(dataQuery?.tinhTrang)}
                      disabled
                    />
                  )}
                </FormControl>

                <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4" }}>
                  Thời gian tạo: {convertDateTime(dataQuery?.createdAt)}
                </Typography>

                {!isPending && (
                  <Typography sx={{ fontSize: "1.3rem", color: "#8b95a8", textAlign: "center" }}>
                    Đơn đã xử lý — chỉ xem, không đổi trạng thái. Duyệt/hủy tại Yêu cầu rút tiền.
                  </Typography>
                )}

                {isPending && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      justifyContent: "center",
                      pt: 1,
                    }}
                  >
                    <Button variant="outlined" onClick={handleSaveStatus}>
                      Lưu thay đổi
                    </Button>
                    <Button
                      onClick={handleApprove}
                      sx={{
                        backgroundColor: "#d4af37",
                        color: "#0b1528",
                        fontWeight: 700,
                        "&:hover": { backgroundColor: "#e5c05b" },
                      }}
                    >
                      Duyệt lệnh
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </AdminSection>
        </Box>

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
              Cập nhật STK nhận tiền cho lệnh này. Sau khi duyệt, tiền chuyển về tài khoản mới.
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
      </Layout>
    </>
  );
};

export default ChiTiet;
export const getServerSideProps = async (context) => {
  const { params } = context;
  return { props: { ID: params.id } };
};
