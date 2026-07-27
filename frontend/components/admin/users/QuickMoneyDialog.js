import UserService from "@/services/admin/UserService";
import { convertJSXMoney } from "@/utils/convertMoney";
import { toast } from "@/utils/toast";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "#0b1528",
    "& fieldset": { borderColor: "rgba(212,175,55,.35)" },
    "&:hover fieldset": { borderColor: "rgba(212,175,55,.55)" },
    "&.Mui-focused fieldset": { borderColor: "#e5c05b" },
  },
  "& .MuiInputLabel-root": { color: "#b8c0d4" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#e5c05b" },
  "& .MuiFormHelperText-root": { color: "#8b95a8" },
};

/**
 * mode: "add" | "sub"
 */
const QuickMoneyDialog = ({ open, onClose, mode = "add", user, onSuccess }) => {
  const isAdd = mode === "add";
  const [amount, setAmount] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setNoiDung("");
    }
  }, [open, mode, user?.id]);

  const currentMoney = Number(user?.money) || 0;
  const amountNum = Number(amount);
  const afterMoney = useMemo(() => {
    if (!Number.isFinite(amountNum) || amountNum <= 0) return currentMoney;
    return isAdd ? currentMoney + amountNum : currentMoney - amountNum;
  }, [amountNum, currentMoney, isAdd]);

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (!isAdd && amountNum > currentMoney) {
      toast.error("Số dư không đủ để trừ");
      return;
    }
    try {
      setLoading(true);
      const res = await UserService.updateMoneyUser({
        userId: user.id,
        moneyUpdate: isAdd ? amountNum : -amountNum,
        noiDung: noiDung.trim(),
      });
      toast.success(res?.data?.message ?? (isAdd ? "Cộng tiền thành công" : "Trừ tiền thành công"));
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi khi cập nhật tiền");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: "#162948",
          color: "#fff",
          borderRadius: "16px",
          border: `1px solid ${isAdd ? "rgba(46,204,113,.4)" : "rgba(239,109,109,.4)"}`,
          m: { xs: "12px", sm: 2 },
          width: { xs: "calc(100% - 24px)", sm: "100%" },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: isAdd ? "#2ecc71" : "#ef6d6d", fontSize: "1.7rem" }}>
        {isAdd ? "Cộng tiền nhanh" : "Trừ tiền nhanh"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", pt: 1 }}>
          <Typography sx={{ fontSize: "1.4rem", color: "#b8c0d4" }}>
            Tài khoản:{" "}
            <Box component="span" sx={{ color: "#e5c05b", fontWeight: 700 }}>
              {user?.taiKhoan}
            </Box>
          </Typography>

          <Box>
            <Typography sx={{ fontSize: "1.25rem", color: "#8b95a8", mb: "4px" }}>Số tiền hiện có</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#e5c05b" }}>
              {convertJSXMoney(currentMoney)}
            </Typography>
          </Box>

          <TextField
            label={isAdd ? "Số tiền cộng" : "Số tiền trừ"}
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            fullWidth
            inputMode="numeric"
            sx={fieldSx}
            autoFocus
          />

          <Box>
            <Typography sx={{ fontSize: "1.25rem", color: "#8b95a8", mb: "4px" }}>
              {isAdd ? "Số tiền sau khi cộng" : "Số tiền sau khi trừ"}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: afterMoney < 0 ? "#ef6d6d" : "#fff",
              }}
            >
              {convertJSXMoney(Math.max(0, afterMoney))}
            </Typography>
          </Box>

          <TextField
            label="Nội dung"
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder={isAdd ? "Lý do cộng tiền..." : "Lý do trừ tiền..."}
            sx={fieldSx}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ minHeight: 44, color: "#b8c0d4", border: "1px solid rgba(255,255,255,.15)" }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            minHeight: 44,
            minWidth: 120,
            fontWeight: 700,
            color: "#0b1528",
            backgroundColor: isAdd ? "#2ecc71" : "#ef6d6d",
            "&:hover": { backgroundColor: isAdd ? "#58d68d" : "#f28b8b" },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#0b1528" }} /> : isAdd ? "Cộng tiền" : "Trừ tiền"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickMoneyDialog;
