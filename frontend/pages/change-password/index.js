import Layout from "@/components/Layout";
import OutlinedInput from "@/components/input/OutlinedInput";
import UserService from "@/services/UserService";
import { Box, Button, FormControl, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { toast } from "@/utils/toast";

const ChangePassword = () => {
  const { status } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }
    try {
      setLoading(true);
      const res = await UserService.changePassword({ currentPassword, newPassword });
      toast.success(res?.data?.message || "Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Đổi mật khẩu" />
      <Layout>
        <h1 className="title-h1">Đổi mật khẩu</h1>
        <Box
          sx={{
            paddingTop: "5rem",
            maxWidth: "48rem",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            color: "#fff",
          }}
        >
          <FormControl fullWidth>
            <Typography sx={{ marginBottom: "6px", color: "#b8c0d4" }}>Mật khẩu cũ</Typography>
            <OutlinedInput
              type="password"
              placeholder="Nhập mật khẩu cũ"
              size="small"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography sx={{ marginBottom: "6px", color: "#b8c0d4" }}>Mật khẩu mới</Typography>
            <OutlinedInput
              type="password"
              placeholder="Nhập mật khẩu mới"
              size="small"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            sx={{ minHeight: "48px", marginTop: "8px" }}
          >
            {loading ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </Box>
      </Layout>
    </>
  );
};

export default ChangePassword;
