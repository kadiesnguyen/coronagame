import MediaPickerDialog from "@/components/admin/MediaPickerDialog";
import OutlinedInput from "@/components/input/OutlinedInput";
import useGetBrandingConfig from "@/hooks/admin/useGetBrandingConfig";
import SystemService from "@/services/admin/SystemService";
import { DEFAULT_BANNERS, DEFAULT_LOGO_URL, resolveMediaUrl } from "@/utils/branding";
import { toast } from "@/utils/toast";
import { Backdrop, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BreadcrumbBar from "../BreadcrumbBar";

const BreadcrumbsData = [
  { title: "Admin", href: "/admin" },
  { title: "Settings", href: "/admin/settings" },
  { title: "Logo & Banner", href: "/admin/settings/branding" },
];

const BrandingSettings = () => {
  const { data, isLoading, refetch } = useGetBrandingConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [banners, setBanners] = useState([]);
  const [picker, setPicker] = useState(null); // { mode: 'logo' | 'banner-add' | 'banner-edit', index?: number }

  useEffect(() => {
    if (!data) return;
    setLogoUrl(data.logoUrl || "");
    setBanners(data.banners?.length ? data.banners : []);
  }, [data]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await SystemService.updateBrandingConfig({
        logoUrl,
        banners,
      });
      refetch();
      toast.success(res?.data?.message ?? "Cập nhật thành công");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setIsSaving(true);
      await SystemService.updateBrandingConfig({
        logoUrl: "",
        banners: [],
      });
      setLogoUrl("");
      setBanners([]);
      refetch();
      toast.success("Đã reset về logo/banner mặc định");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Reset thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePick = (url) => {
    if (!picker) return;
    if (picker.mode === "logo") {
      setLogoUrl(url);
      toast.success("Đã chọn logo — nhớ bấm Lưu");
      return;
    }
    if (picker.mode === "banner-add") {
      setBanners((prev) => [...prev, { url, desc: "", status: true }]);
      toast.success("Đã thêm banner — nhớ bấm Lưu");
      return;
    }
    if (picker.mode === "banner-edit" && typeof picker.index === "number") {
      setBanners((prev) => prev.map((b, i) => (i === picker.index ? { ...b, url } : b)));
      toast.success("Đã đổi ảnh banner — nhớ bấm Lưu");
    }
  };

  const previewLogo = resolveMediaUrl(logoUrl || DEFAULT_LOGO_URL);
  const previewBanners = banners.length
    ? banners
    : DEFAULT_BANNERS.map((item) => ({ ...item, status: true }));

  return (
    <>
      <BreadcrumbBar data={BreadcrumbsData} />
      <h1 className="title" style={{ fontSize: "2.5rem" }}>
        Logo & Banner Slider
      </h1>
      <Typography sx={{ marginBottom: "16px", color: "text.secondary" }}>
        Chọn ảnh từ thư viện media hoặc upload mới, rồi bấm Lưu để áp dụng.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "720px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Typography sx={{ fontWeight: 700 }}>Logo header</Typography>
          <Box
            sx={{
              background: "#0b1528",
              borderRadius: "12px",
              padding: "12px",
              width: "fit-content",
            }}
          >
            <img src={previewLogo} alt="logo preview" style={{ height: 44, width: "auto", maxWidth: 240 }} />
          </Box>
          <Button onClick={() => setPicker({ mode: "logo" })} sx={{ width: "fit-content", minHeight: "46px" }}>
            Chọn logo
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Typography sx={{ fontWeight: 700 }}>Banner slider trang chủ</Typography>
          <Button
            onClick={() => setPicker({ mode: "banner-add" })}
            sx={{ width: "fit-content", minHeight: "46px" }}
          >
            Thêm banner
          </Button>

          {previewBanners.map((item, index) => (
            <Box
              key={`${item.url}-${index}`}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <img
                src={resolveMediaUrl(item.url)}
                alt={item.desc || `banner-${index + 1}`}
                style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }}
              />
              {banners.length > 0 && (
                <>
                  <OutlinedInput
                    placeholder="Mô tả banner"
                    value={item.desc || ""}
                    onChange={(e) =>
                      setBanners((prev) =>
                        prev.map((banner, i) => (i === index ? { ...banner, desc: e.target.value } : banner))
                      )
                    }
                    fullWidth
                  />
                  <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Button onClick={() => setPicker({ mode: "banner-edit", index })}>Đổi ảnh</Button>
                    <Button
                      onClick={() =>
                        setBanners((prev) =>
                          prev.map((banner, i) =>
                            i === index ? { ...banner, status: banner.status === false } : banner
                          )
                        )
                      }
                    >
                      {item.status === false ? "Bật" : "Tắt"}
                    </Button>
                    <Button
                      onClick={() => setBanners((prev) => prev.filter((_, i) => i !== index))}
                      sx={{ background: "#c62828" }}
                    >
                      Xóa
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          ))}
          {!banners.length && (
            <Typography sx={{ color: "text.secondary" }}>
              Đang dùng banner mặc định. Thêm banner từ thư viện để thay thế danh sách mặc định.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button onClick={handleSave} disabled={isSaving} sx={{ minHeight: "46px" }}>
            Lưu cấu hình
          </Button>
          <Button onClick={handleResetDefaults} disabled={isSaving} sx={{ minHeight: "46px" }}>
            Reset mặc định
          </Button>
        </Box>
      </Box>

      <MediaPickerDialog
        open={!!picker}
        onClose={() => setPicker(null)}
        onSelect={handlePick}
        title={picker?.mode === "logo" ? "Chọn logo" : "Chọn banner"}
      />

      <Backdrop open={isLoading || isSaving}>
        <CircularProgress />
      </Backdrop>
    </>
  );
};

export default BrandingSettings;
