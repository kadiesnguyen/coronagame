import { registerToastHandler } from "@/utils/toast";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const META = {
  success: {
    title: "Thành công",
    color: "#e5c05b",
    Icon: CheckCircleOutlineIcon,
  },
  error: {
    title: "Thông báo",
    color: "#ef6d6d",
    Icon: ErrorOutlineIcon,
  },
  info: {
    title: "Thông báo",
    color: "#5aa0ff",
    Icon: InfoOutlinedIcon,
  },
};

const ClientAlertHost = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState({ type: "info", message: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // useLayoutEffect: đăng ký handler trước paint, tránh miss toast sớm
  useLayoutEffect(() => {
    registerToastHandler((next) => {
      setPayload({
        type: next?.type === "success" || next?.type === "error" ? next.type : "info",
        message: next?.message || "Thông báo",
      });
      setOpen(true);
    });
    return () => registerToastHandler(null);
  }, []);

  const meta = META[payload.type] || META.info;
  const Icon = meta.Icon;

  if (!mounted || !open) return null;

  return createPortal(
    <Box
      onClick={() => setOpen(false)}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        backgroundColor: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "12px",
      }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#162948",
          color: "#fff",
          borderRadius: "16px",
          border: `1px solid ${meta.color}55`,
          boxShadow: "0 16px 48px rgba(0,0,0,.45)",
          p: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", color: meta.color }}>
          <Icon sx={{ fontSize: 26 }} />
          <Typography sx={{ fontWeight: 800, fontSize: "1.7rem", color: meta.color }}>{meta.title}</Typography>
        </Box>
        <Typography sx={{ fontSize: "1.5rem", color: "#fff", wordBreak: "break-word", lineHeight: 1.45, minHeight: 44 }}>
          {payload.message}
        </Typography>
        <Button
          onClick={() => setOpen(false)}
          sx={{
            alignSelf: "flex-end",
            minHeight: 44,
            minWidth: 96,
            backgroundColor: "#d4af37",
            color: "#0b1528",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#e5c05b" },
          }}
        >
          Đóng
        </Button>
      </Box>
    </Box>,
    document.body
  );
};

export default ClientAlertHost;
