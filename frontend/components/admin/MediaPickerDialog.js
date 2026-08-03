import SystemService from "@/services/admin/SystemService";
import { DEFAULT_BANNERS, DEFAULT_LOGO_URL, resolveMediaUrl } from "@/utils/branding";
import { toast } from "@/utils/toast";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_MEDIA = [
  { url: DEFAULT_LOGO_URL, name: "logo-default", folder: "default", mtimeMs: 0 },
  ...DEFAULT_BANNERS.map((b, i) => ({
    url: b.url,
    name: `banner-default-${i + 1}`,
    folder: "default",
    mtimeMs: 0,
  })),
];

/**
 * Shared admin media picker.
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {(url: string) => void} onSelect
 * @param {string} [title]
 */
const MediaPickerDialog = ({ open, onClose, onSelect, title = "Chọn ảnh" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await SystemService.listMediaLibrary();
      const remote = Array.isArray(res?.data?.data) ? res.data.data : [];
      const seen = new Set(remote.map((x) => x.url));
      const defaults = DEFAULT_MEDIA.filter((x) => !seen.has(x.url));
      setItems([...remote, ...defaults]);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Không tải được thư viện ảnh");
      setItems(DEFAULT_MEDIA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelected("");
    void load();
  }, [open, load]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setUploading(true);
      const res = await SystemService.uploadMediaAsset(file);
      const url = res?.data?.data?.url;
      if (!url) throw new Error("Upload thất bại");
      toast.success("Upload thành công");
      await load();
      setSelected(url);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (!selected) {
      toast.error("Vui lòng chọn một ảnh");
      return;
    }
    onSelect(selected);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: "#0f1c33",
          color: "#fff",
          border: "1px solid rgba(212,175,55,.35)",
        },
      }}
    >
      <DialogTitle sx={{ color: "#e5c05b", fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: "12px", mb: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <Button
            component="label"
            disabled={uploading}
            startIcon={<CloudUploadOutlinedIcon />}
            sx={{
              minHeight: 46,
              backgroundColor: "#d4af37",
              color: "#0b1528",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#e5c05b" },
            }}
          >
            Upload mới
            <input hidden type="file" accept="image/*" onChange={handleUpload} />
          </Button>
          <Typography sx={{ color: "#b8c0d4", fontSize: "1.3rem" }}>
            Chọn ảnh có sẵn hoặc upload rồi chọn.
          </Typography>
        </Box>

        {loading || uploading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#e5c05b" }} />
          </Box>
        ) : items.length === 0 ? (
          <Typography sx={{ color: "#b8c0d4", py: 3, textAlign: "center" }}>
            Chưa có ảnh nào. Bấm Upload mới để thêm.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "12px",
              maxHeight: "50vh",
              overflowY: "auto",
              pr: "4px",
            }}
          >
            {items.map((item) => {
              const active = selected === item.url;
              return (
                <Box
                  key={item.url}
                  component="button"
                  type="button"
                  onClick={() => setSelected(item.url)}
                  sx={{
                    border: active ? "2px solid #d4af37" : "1px solid rgba(255,255,255,.15)",
                    borderRadius: "10px",
                    p: 0,
                    m: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#0b1528",
                    aspectRatio: "1 / 1",
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={resolveMediaUrl(item.url)}
                    alt={item.name || "media"}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: "20px", pb: "16px", gap: "8px" }}>
        <Button onClick={onClose} sx={{ minHeight: 44, color: "#b8c0d4" }}>
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selected}
          sx={{
            minHeight: 44,
            backgroundColor: "#d4af37",
            color: "#0b1528",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#e5c05b" },
            "&.Mui-disabled": { backgroundColor: "rgba(212,175,55,.3)", color: "#666" },
          }}
        >
          Chọn ảnh
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaPickerDialog;
