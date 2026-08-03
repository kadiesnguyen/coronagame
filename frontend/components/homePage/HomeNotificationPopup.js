import useGetListNotifications from "@/hooks/useGetListNotifications";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const SIZE = "min(90vw, 360px)";

const HomeNotificationPopup = () => {
  const { status } = useSession();
  const { data, isLoading } = useGetListNotifications({ limitItems: 20 });
  const items = useMemo(
    () => (Array.isArray(data) ? data.filter((x) => x?._id && (x?.noiDung || x?.tieuDe)) : []),
    [data]
  );

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || isLoading || items.length === 0) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [status, isLoading, items.length]);

  const handleClose = () => setOpen(false);

  if (!mounted || !open || items.length === 0) return null;

  return createPortal(
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2147482900,
        backgroundColor: "rgba(0,0,0,.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "12px",
      }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        aria-label="Thông báo"
        sx={{
          width: SIZE,
          maxWidth: "100%",
          backgroundColor: "#0f1c33",
          borderRadius: "12px",
          border: "1px solid rgba(212,175,55,.4)",
          boxShadow: "0 16px 48px rgba(0,0,0,.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: "12px",
            py: "8px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <Typography sx={{ color: "#e5c05b", fontWeight: 700, fontSize: "1.4rem" }}>Thông báo</Typography>
          <IconButton
            aria-label="Tắt quảng cáo"
            onClick={handleClose}
            size="small"
            sx={{ color: "#fff", minWidth: 44, minHeight: 44 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            position: "relative",
            backgroundColor: "#0b1528",
            "& .swiper": { width: "100%", height: "100%" },
            "& .swiper-wrapper": { height: "100%" },
            "& .swiper-slide": { height: "100%", width: "100%", overflow: "hidden" },
            "& .swiper-pagination-bullet": { background: "#fff", opacity: 0.45 },
            "& .swiper-pagination-bullet-active": { background: "#d4af37", opacity: 1 },
          }}
        >
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={0}
            slidesPerView={1}
            nested
            style={{ width: "100%", height: "100%" }}
          >
            {items.map((item) => (
              <SwiperSlide key={item._id} style={{ height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    p: "16px",
                    pb: "28px",
                    color: "#fff",
                    textAlign: "left",
                    overflowY: "auto",
                    overflowX: "hidden",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                    gap: "12px",
                    boxSizing: "border-box",
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Typography sx={{ color: "#e5c05b", fontWeight: 700, fontSize: "1.6rem", flexShrink: 0 }}>
                    {item.tieuDe || "Thông báo"}
                  </Typography>
                  <Box
                    className="content-html"
                    sx={{
                      color: "#d7deee",
                      fontSize: "1.35rem",
                      lineHeight: 1.5,
                      "& img": { maxWidth: "100%", height: "auto", display: "block", borderRadius: "8px" },
                      "& p": { margin: "0 0 8px" },
                      "& a": { color: "#e5c05b" },
                    }}
                    dangerouslySetInnerHTML={{ __html: item.noiDung || "" }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Box sx={{ px: "12px", py: "12px" }}>
          <Button
            onClick={handleClose}
            fullWidth
            sx={{
              minHeight: "48px",
              backgroundColor: "#d4af37",
              color: "#0b1528",
              fontWeight: 700,
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#e5c05b" },
            }}
          >
            Tắt quảng cáo
          </Button>
        </Box>
      </Box>
    </Box>,
    document.body
  );
};

export default HomeNotificationPopup;
