import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_PASSWORD, ROLE_USER, TINH_TRANG_USER, convertRole } from "@/configs/user.config";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import { InputComponent } from "@/custom/textfield";
import useGetDetailedUser from "@/hooks/admin/useGetDetailedUser";
import UserService from "@/services/admin/UserService";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertTinhTrangUser } from "@/utils/convertTinhTrang";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import toast from "@/utils/toast";
import AdminSection from "../games/AdminSection";
import BreadcrumbBar from "../BreadcrumbBar";

const listStatus = Object.keys(TINH_TRANG_USER).map((key) => ({
  tenStatus: convertTinhTrangUser(TINH_TRANG_USER[key]),
  value: TINH_TRANG_USER[key],
}));

const listRole = Object.keys(ROLE_USER).map((key) => ({
  ten: convertRole(ROLE_USER[key]),
  value: ROLE_USER[key],
}));

const StatCard = ({ icon, label, value }) => (
  <Box
    sx={{
      minWidth: 0,
      borderRadius: "14px",
      padding: "16px",
      backgroundColor: "#101d33",
      border: "1px solid rgba(212,175,55,.25)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(212,175,55,.12)",
        color: "#e5c05b",
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#e5c05b", wordBreak: "break-word" }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4" }}>{label}</Typography>
  </Box>
);

const DetailedUser = ({ ID }) => {
  const BreadcrumbData = [
    { title: "Admin", href: "/admin" },
    { title: "Quản lý người dùng", href: "/admin/users" },
    { title: "Chi tiết", href: "/admin/users/" + ID },
  ];
  const { data: dataQuery, isLoading, refetch } = useGetDetailedUser({ id: ID });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [status, setStatus] = useState(true);
  const [role, setRole] = useState(ROLE_USER.USER);
  const [congTien, setCongTien] = useState(0);
  const [truTien, setTruTien] = useState(0);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (dataQuery) {
      setStatus(dataQuery?.status ?? true);
      setRole(dataQuery?.role ?? ROLE_USER.USER);
    }
  }, [dataQuery]);

  const handleClickCongTruTien = async (type = 1) => {
    try {
      const moneyUpdate = Number(type === 1 ? congTien : truTien);
      if (!Number.isFinite(moneyUpdate) || moneyUpdate <= 0) {
        toast.error("Vui lòng nhập tiền hợp lệ");
        return;
      }
      setIsLoadingState(true);
      const res = await UserService.updateMoneyUser({
        userId: ID,
        moneyUpdate: type === 1 ? moneyUpdate : -moneyUpdate,
        noiDung: type === 1 ? "Admin cộng tiền (chi tiết user)" : "Admin trừ tiền (chi tiết user)",
      });
      toast.success(res?.data?.message ?? "Cập nhật tiền thành công");
      if (type === 1) setCongTien(0);
      else setTruTien(0);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật tiền");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleClickChangeInfo = async () => {
    try {
      if (!role || !Object.values(ROLE_USER).includes(role)) {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      setIsLoadingState(true);
      const res = await UserService.updateInformationUser({ userId: ID, status, role });
      toast.success(res?.data?.message ?? "Cập nhật thông tin thành công");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật thông tin");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleClickChangePassword = async () => {
    try {
      if (!password || password.trim().length < MIN_LENGTH_PASSWORD) {
        toast.error(`Vui lòng nhập mật khẩu từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`);
        return;
      }
      setIsLoadingState(true);
      const res = await UserService.updatePasswordUser({
        userId: ID,
        newPassword: password.trim(),
      });
      toast.success(res?.data?.message ?? "Cập nhật mật khẩu thành công");
      setPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật mật khẩu");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingState}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ width: "100%", maxWidth: "96rem", display: "flex", flexDirection: "column", gap: "16px" }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#e5c05b" }} />
          </Box>
        )}

        {dataQuery && (
          <>
            <AdminSection title="Chi tiết người dùng" subtitle={`Tài khoản ${dataQuery.taiKhoan}`}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0,1fr))" },
                  gap: "12px",
                  mb: "16px",
                }}
              >
                <StatCard
                  icon={<SavingsOutlinedIcon />}
                  label="Số dư hiện tại"
                  value={convertJSXMoney(dataQuery.money)}
                />
                <StatCard
                  icon={<TrendingUpIcon />}
                  label="Tổng tiền cược"
                  value={convertJSXMoney(dataQuery.tienCuoc)}
                />
                <StatCard
                  icon={<PersonOutlineIcon />}
                  label="Tổng tiền thắng"
                  value={convertJSXMoney(dataQuery.tienThang)}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: "12px",
                }}
              >
                <FormControl fullWidth>
                  <Typography sx={{ mb: 0.5 }}>Tài khoản</Typography>
                  <OutlinedInput size="small" fullWidth value={dataQuery.taiKhoan} disabled />
                </FormControl>
                <FormControl fullWidth>
                  <Typography sx={{ mb: 0.5 }}>Thời gian tạo</Typography>
                  <OutlinedInput size="small" fullWidth value={convertDateTime(dataQuery.createdAt)} disabled />
                </FormControl>
                <FormControl fullWidth>
                  <Typography sx={{ mb: 0.5 }}>Tình trạng</Typography>
                  <Select
                    labelId="select-status"
                    input={<OptionMenu />}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {listStatus.map((item) => (
                      <OptionMenuItem key={String(item.value)} value={item.value}>
                        {item.tenStatus}
                      </OptionMenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Typography sx={{ mb: 0.5 }}>Phân quyền</Typography>
                  <Select
                    labelId="select-role"
                    input={<OptionMenu />}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {listRole.map((item) => (
                      <OptionMenuItem key={item.value} value={item.value}>
                        {item.ten}
                      </OptionMenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  onClick={handleClickChangeInfo}
                  sx={{ backgroundColor: "#d4af37", color: "#0b1528", "&:hover": { backgroundColor: "#e5c05b" } }}
                >
                  Lưu thông tin
                </Button>
              </Box>
            </AdminSection>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: "16px",
              }}
            >
              <AdminSection title="Cộng / Trừ tiền" subtitle="Điều chỉnh số dư thủ công">
                <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleClickCongTruTien(1);
                    }}
                  >
                    <FormControl fullWidth sx={{ gap: "8px" }}>
                      <Typography>Cộng tiền</Typography>
                      <OutlinedInput
                        placeholder="Số tiền"
                        size="small"
                        type="text"
                        fullWidth
                        onWheel={(e) => e.target.blur()}
                        value={congTien}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") {
                            setCongTien("");
                            return;
                          }
                          const n = parseInt(v, 10);
                          setCongTien(isNaN(n) ? "" : n);
                        }}
                      />
                      <Button type="submit" startIcon={<AddCircleOutlineIcon />} variant="outlined">
                        Cộng
                      </Button>
                    </FormControl>
                  </form>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleClickCongTruTien(2);
                    }}
                  >
                    <FormControl fullWidth sx={{ gap: "8px" }}>
                      <Typography>Trừ tiền</Typography>
                      <OutlinedInput
                        placeholder="Số tiền"
                        size="small"
                        type="text"
                        fullWidth
                        onWheel={(e) => e.target.blur()}
                        value={truTien}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") {
                            setTruTien("");
                            return;
                          }
                          const n = parseInt(v, 10);
                          setTruTien(isNaN(n) ? "" : n);
                        }}
                      />
                      <Button type="submit" startIcon={<RemoveCircleOutlineIcon />} variant="outlined" color="error">
                        Trừ
                      </Button>
                    </FormControl>
                  </form>
                </Box>
              </AdminSection>

              <AdminSection title="Đổi mật khẩu" subtitle="Đặt mật khẩu mới cho tài khoản">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleClickChangePassword();
                  }}
                >
                  <FormControl fullWidth sx={{ gap: "8px" }}>
                    <Typography>Mật khẩu mới</Typography>
                    <InputComponent
                      placeholder="Mật khẩu"
                      size="small"
                      type="text"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      startIcon={<LockResetIcon />}
                      sx={{ backgroundColor: "#d4af37", color: "#0b1528", "&:hover": { backgroundColor: "#e5c05b" } }}
                    >
                      Đổi mật khẩu
                    </Button>
                  </FormControl>
                </form>
              </AdminSection>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default DetailedUser;
