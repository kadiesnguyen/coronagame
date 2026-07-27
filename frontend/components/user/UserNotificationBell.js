import SocketContext from "@/context/socket";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { toast } from "@/utils/toast";
import {
  countUnreadUserAlerts,
  loadUserAlerts,
  markAllUserAlertsRead,
  markUserAlertRead,
  saveUserAlerts,
  upsertUserAlert,
} from "@/utils/userAlerts";
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

const USER_NOTIFY_EVENT = "user:notification";
let lastToastedNotifyId = null;

const UserNotificationBell = ({ size = 40 }) => {
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState(() => loadUserAlerts());

  const persist = useCallback((next) => {
    setState(next);
    saveUserAlerts(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("user-alerts-changed"));
    }
  }, []);

  useEffect(() => {
    const sync = () => setState(loadUserAlerts());
    window.addEventListener("user-alerts-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("user-alerts-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!socket) return undefined;
    const onNotify = (payload) => {
      if (!payload?.id) return;
      const alert = {
        id: payload.id,
        type: payload.type,
        href: payload.href || (payload.type === "withdraw" ? "/withdraw-history" : "/deposit-history"),
        title: payload.title || "Thông báo",
        message: payload.message || "",
        soTien: payload.soTien,
        status: payload.status,
        createdAt: payload.createdAt || new Date().toISOString(),
      };
      persist(upsertUserAlert(loadUserAlerts(), alert));
      // 2 chuông (header + fixed) cùng listen — chỉ toast 1 lần
      if (lastToastedNotifyId === payload.id) return;
      lastToastedNotifyId = payload.id;
      if (payload.status === "hoanTat") toast.success(payload.message || payload.title);
      else if (payload.status === "daHuy") toast.error(payload.message || payload.title);
      else toast.info(payload.message || payload.title);
    };
    socket.on(USER_NOTIFY_EVENT, onNotify);
    return () => {
      socket.off(USER_NOTIFY_EVENT, onNotify);
    };
  }, [socket, persist]);

  const unread = countUnreadUserAlerts(state);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClickItem = (item) => {
    persist(markUserAlertRead(state, item.id));
    handleClose();
    if (item.href) router.push(item.href);
  };

  const handleMarkAll = () => {
    persist(markAllUserAlertsRead(state));
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{
          width: size,
          height: size,
          borderRadius: "10px",
          color: "#e5c05b",
          p: 0,
          "&:hover": { backgroundColor: "rgba(212,175,55,.15)" },
        }}
        aria-label="Thông báo nạp rút"
      >
        <Badge
          badgeContent={unread}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "1rem",
              minWidth: 16,
              height: 16,
              fontWeight: 700,
            },
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: size > 36 ? 24 : 22 }} />
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
            width: { xs: "min(340px, calc(100vw - 24px))", sm: 360 },
            maxHeight: 420,
            backgroundColor: "#162948",
            color: "#fff",
            border: "1px solid rgba(212,175,55,.35)",
            borderRadius: "14px",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography sx={{ fontWeight: 800, color: "#e5c05b", fontSize: "1.5rem" }}>Thông báo</Typography>
          <Button size="small" onClick={handleMarkAll} disabled={unread === 0} sx={{ minHeight: 36, color: "#b8c0d4" }}>
            Đánh dấu đã đọc
          </Button>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />
        {state.items.length === 0 && (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography sx={{ color: "#8b95a8", fontSize: "1.3rem", textAlign: "center" }}>
              Chưa có thông báo nạp / rút
            </Typography>
          </Box>
        )}
        {state.items.map((item) => {
          const isUnread = !state.readIds.includes(item.id);
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
                backgroundColor: isUnread ? "rgba(212,175,55,.08)" : "transparent",
                borderLeft: isUnread ? "3px solid #d4af37" : "3px solid transparent",
                "&:hover": { backgroundColor: "rgba(212,175,55,.14)" },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.35rem", color: "#fff" }}>{item.title}</Typography>
              <Typography sx={{ fontSize: "1.25rem", color: "#b8c0d4" }}>{item.message}</Typography>
              {item.soTien != null && (
                <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, color: "#e5c05b" }}>
                  {convertJSXMoney(item.soTien)}
                </Typography>
              )}
              <Typography sx={{ fontSize: "1.15rem", color: "#8b95a8" }}>
                {convertDateTime(item.createdAt)}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default UserNotificationBell;
