import UserService from "@/services/UserService";
import handleLogout from "@/utils/logout";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "@/utils/toast";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "#101d33",
    "& fieldset": { borderColor: "rgba(212,175,55,.35)" },
    "&:hover fieldset": { borderColor: "#e5c05b" },
    "&.Mui-focused fieldset": { borderColor: "#e5c05b" },
  },
  "& .MuiInputLabel-root": { color: "#b8c0d4" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#e5c05b" },
};

const AdminAccountMenu = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPw, setOpenPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const taiKhoan = session?.user?.taiKhoan || "A";
  const initial = String(taiKhoan).charAt(0).toUpperCase();

  const closeMenu = () => setAnchorEl(null);

  const openPasswordDialog = () => {
    closeMenu();
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setOpenPw(true);
  };

  const onLogout = async () => {
    closeMenu();
    if (session) {
      await handleLogout(session, "/admin/login");
    }
  };

  const onChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới nhập lại không khớp");
      return;
    }
    try {
      setLoading(true);
      const res = await UserService.changePassword({ currentPassword, newPassword });
      toast.success(res?.data?.message || "Đổi mật khẩu thành công");
      setOpenPw(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          p: 0.5,
          border: "1px solid rgba(212,175,55,.4)",
          "&:hover": { borderColor: "#e5c05b" },
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#162948",
            color: "#e5c05b",
            fontWeight: 700,
            fontSize: "1.4rem",
          }}
        >
          {initial}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            backgroundColor: "#162948",
            color: "#fff",
            border: "1px solid rgba(212,175,55,.3)",
            boxShadow: "0 12px 32px rgba(0,0,0,.45)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.4rem" }}>{taiKhoan}</Typography>
          <Typography sx={{ color: "#b8c0d4", fontSize: "1.2rem" }}>Quản trị viên</Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,.1)" }} />
        <MenuItem onClick={openPasswordDialog} sx={{ gap: 1.2, py: 1.2, fontSize: "1.4rem" }}>
          <ManageAccountsOutlinedIcon sx={{ color: "#5fb3b3" }} fontSize="small" />
          Quản lý thông tin
        </MenuItem>
        <MenuItem onClick={onLogout} sx={{ gap: 1.2, py: 1.2, fontSize: "1.4rem" }}>
          <LogoutOutlinedIcon sx={{ color: "#5fb3b3" }} fontSize="small" />
          Đăng xuất
        </MenuItem>
      </Menu>

      <Dialog
        open={openPw}
        onClose={() => !loading && setOpenPw(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "#162948",
            color: "#fff",
            border: "1px solid rgba(212,175,55,.3)",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800 }}>
          <LockOutlinedIcon sx={{ color: "#e5c05b" }} />
          Đổi mật khẩu
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
          <FormControl fullWidth>
            <TextField
              label="Mật khẩu cũ"
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => setForm((s) => ({ ...s, currentPassword: e.target.value }))}
              sx={fieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrent((v) => !v)} edge="end" sx={{ color: "#b8c0d4" }}>
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Mật khẩu mới"
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => setForm((s) => ({ ...s, newPassword: e.target.value }))}
              sx={fieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew((v) => !v)} edge="end" sx={{ color: "#b8c0d4" }}>
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Nhập lại mật khẩu mới"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
              sx={fieldSx}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setOpenPw(false)}
            disabled={loading}
            sx={{ color: "#b8c0d4", minHeight: 44 }}
          >
            Hủy
          </Button>
          <Button
            onClick={onChangePassword}
            disabled={loading}
            variant="contained"
            sx={{
              minHeight: 44,
              backgroundColor: "#d4af37",
              color: "#0b1528",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#e5c05b" },
            }}
          >
            {loading ? "Đang đổi..." : "Đổi mật khẩu"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminAccountMenu;
