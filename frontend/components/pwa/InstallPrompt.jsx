// components/InstallPrompt.tsx
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Kiểm tra thiết bị di động
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      // Thêm kiểm tra kích thước màn hình
      const isMobileScreen = window.matchMedia("(max-width: 768px)").matches;
      return isMobileDevice && isMobileScreen;
    };

    setIsMobile(checkMobile());

    // Xử lý cho Android
    const handleBeforeInstallPrompt = (e) => {
      if (!checkMobile()) return; // Chỉ xử lý trên mobile

      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Xử lý cho iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    if (isIOS && !isStandalone && checkMobile()) {
      setTimeout(() => setShowIOSPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome} the install prompt`);
      setDeferredPrompt(null);
      setShowAndroidPrompt(false);
    } catch (err) {
      console.error("Error installing app:", err);
    }
  };

  const handleClose = () => {
    setShowIOSPrompt(false);
    setShowAndroidPrompt(false);
  };

  // Không hiển thị gì nếu không phải thiết bị di động
  if (!isMobile) return null;

  return (
    <>
      <Dialog open={showIOSPrompt} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Cài đặt ứng dụng</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Thêm ứng dụng này vào màn hình chính của bạn:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="Nhấn vào biểu tượng Chia sẻ" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Chọn 'Thêm vào màn hình chính'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Nhấn 'Thêm' để xác nhận" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showAndroidPrompt} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Cài đặt ứng dụng</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Cài đặt ứng dụng này để sử dụng tốt hơn
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button onClick={handleInstallClick} variant="contained" color="primary">
            Cài đặt
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
