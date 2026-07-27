import SystemService from "@/services/SystemService";

/** Mở link CSKH (cấu hình admin). Fallback /contact nếu chưa có link. */
export const openCskh = async () => {
  try {
    const res = await SystemService.getTawkToConfig();
    const link = String(res?.data?.data?.link || "").trim();
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
  } catch (_err) {
    // fall through
  }
  window.location.href = "/contact";
};
