import { KEYS_SOCKET_ADMIN } from "@/configs/admin.socket.config";
import SocketContext from "@/context/socket";
import DepositService from "@/services/admin/DepositService";
import WithdrawService from "@/services/admin/WithdrawService";
import {
  countUnreadAlerts,
  loadAdminAlerts,
  markAlertRead,
  markAllAlertsRead,
  saveAdminAlerts,
  upsertAlert,
} from "@/utils/adminAlerts";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

const toAlertFromDeposit = (item) => ({
  id: `deposit:${item._id}`,
  type: "deposit",
  href: "/admin/deposit",
  title: "Yêu cầu nạp tiền",
  message: `${item.nguoiDung?.taiKhoan || "User"} gửi yêu cầu nạp`,
  soTien: item.soTien,
  createdAt: item.createdAt,
});

const toAlertFromWithdraw = (item) => ({
  id: `withdraw:${item._id}`,
  type: "withdraw",
  href: "/admin/withdraw",
  title: "Yêu cầu rút tiền",
  message: `${item.nguoiDung?.taiKhoan || "User"} gửi yêu cầu rút`,
  soTien: item.soTien,
  createdAt: item.createdAt,
});

const AdminNotificationBell = () => {
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState(() => loadAdminAlerts());

  const persist = useCallback((next) => {
    setState(next);
    saveAdminAlerts(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const seed = async () => {
      try {
        const [depRes, witRes] = await Promise.all([
          DepositService.getListDepositHistory({ page: 1, pageSize: 20, statusGroup: "pending" }),
          WithdrawService.getListWithdrawHistory({ page: 1, pageSize: 20, statusGroup: "pending" }),
        ]);
        if (cancelled) return;
        let next = loadAdminAlerts();
        (depRes?.data?.data || []).forEach((item) => {
          next = upsertAlert(next, toAlertFromDeposit(item));
        });
        (witRes?.data?.data || []).forEach((item) => {
          next = upsertAlert(next, toAlertFromWithdraw(item));
        });
        next = {
          ...next,
          items: [...next.items].sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          ),
        };
        persist(next);
      } catch (_err) {
        // ignore seed errors
      }
    };
    seed();
    return () => {
      cancelled = true;
    };
  }, [persist]);

  useEffect(() => {
    if (!socket) return undefined;
    const onNew = (payload) => {
      if (!payload?.id) return;
      const alert = {
        id: `${payload.type}:${payload.id}`,
        type: payload.type,
        href: payload.href || (payload.type === "withdraw" ? "/admin/withdraw" : "/admin/deposit"),
        title: payload.title || "Yêu cầu mới",
        message: payload.message || "",
        soTien: payload.soTien,
        createdAt: payload.createdAt || new Date().toISOString(),
      };
      persist(upsertAlert(loadAdminAlerts(), alert));
    };
    socket.on(KEYS_SOCKET_ADMIN.NEW_REQUEST, onNew);
    return () => {
      socket.off(KEYS_SOCKET_ADMIN.NEW_REQUEST, onNew);
    };
  }, [socket, persist]);

  const unread = countUnreadAlerts(state);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClickItem = (item) => {
    persist(markAlertRead(state, item.id));
    handleClose();
    router.push(item.href);
  };

  const handleMarkAll = () => {
    persist(markAllAlertsRead(state));
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          color: "#e5c05b",
          backgroundColor: "#101d33",
          border: "1px solid rgba(212,175,55,.35)",
          "&:hover": { backgroundColor: "rgba(212,175,55,.18)" },
        }}
      >
        <Badge
          badgeContent={unread}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "1.05rem",
              minWidth: 18,
              height: 18,
              fontWeight: 700,
            },
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: "min(360px, calc(100vw - 24px))", sm: 380 },
            maxHeight: 440,
            backgroundColor: "#162948",
            color: "#fff",
            border: "1px solid rgba(212,175,55,.35)",
            borderRadius: "14px",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#e5c05b" }}>Thông báo</Typography>
          <Button size="small" onClick={handleMarkAll} sx={{ minHeight: 36, fontSize: "1.2rem", color: "#b8c0d4" }}>
            Đánh dấu đã đọc
          </Button>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />
        {state.items.length === 0 ? (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography sx={{ color: "#8b95a8", fontSize: "1.35rem", textAlign: "center" }}>
              Không có yêu cầu nạp / rút
            </Typography>
          </Box>
        ) : (
          state.items.map((item) => {
            const isRead = state.readIds.includes(item.id);
            return (
              <MenuItem
                key={item.id}
                onClick={() => handleClickItem(item)}
                sx={{
                  alignItems: "flex-start",
                  flexDirection: "column",
                  gap: "4px",
                  py: 1.25,
                  px: 2,
                  whiteSpace: "normal",
                  backgroundColor: isRead ? "transparent" : "rgba(212,175,55,.08)",
                  borderBottom: "1px solid rgba(255,255,255,.06)",
                  "&:hover": { backgroundColor: "rgba(212,175,55,.16)" },
                }}
              >
                <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.35rem", color: isRead ? "#b8c0d4" : "#e5c05b" }}>
                    {item.title}
                  </Typography>
                  {!isRead && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ef6d6d", mt: "6px", flexShrink: 0 }} />
                  )}
                </Box>
                <Typography sx={{ fontSize: "1.25rem", color: "#fff", width: "100%" }}>{item.message}</Typography>
                {item.soTien != null && (
                  <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, color: "#e5c05b" }}>
                    {convertJSXMoney(item.soTien)}
                  </Typography>
                )}
                <Typography sx={{ fontSize: "1.15rem", color: "#8b95a8" }}>
                  {item.createdAt ? convertDateTime(item.createdAt) : ""}
                </Typography>
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
};

export default AdminNotificationBell;
