import LoadingBox from "@/components/homePage/LoadingBox";
import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_ACCOUNT, MIN_LENGTH_PASSWORD } from "@/configs/user.config";
import Logo from "@/public/assets/images/logo.png";
import { toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, FormControl, IconButton, InputAdornment, Typography } from "@mui/material";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const AdminLogin = () => {
  const { status } = useSession();
  const router = useRouter();
  const { callbackUrl } = router.query;
  const [loginStatus, setLoginStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    account: Yup.string()
      .required("Vui lòng nhập tài khoản")
      .min(MIN_LENGTH_ACCOUNT, `Tài khoản phải từ ${MIN_LENGTH_ACCOUNT} kí tự trở lên`)
      .trim("Tài khoản không hợp lệ")
      .matches(/^\S*$/, "Tài khoản không hợp lệ")
      .strict(true),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(MIN_LENGTH_PASSWORD, `Mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`)
      .trim("Mật khẩu không hợp lệ")
      .matches(/^\S*$/, "Mật khẩu không hợp lệ")
      .strict(true),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (status === "authenticated") {
      getSession().then((session) => {
        if (session?.user?.role === "admin") {
          const next = typeof callbackUrl === "string" && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";
          router.replace(next);
        }
      });
    }
  }, [status, callbackUrl, router]);

  const onSubmit = async (data) => {
    try {
      setLoginStatus("loading");
      const result = await signIn("login", {
        taiKhoan: data.account,
        matKhau: data.password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      const session = await getSession();
      if (session?.user?.role !== "admin") {
        await signOut({ redirect: false });
        throw new Error("Tài khoản không có quyền truy cập admin");
      }
      setLoginStatus("success");
      const next = typeof callbackUrl === "string" && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";
      router.replace(next);
    } catch (err) {
      toast.error(err?.message || "Đăng nhập thất bại");
      setLoginStatus(null);
    }
  };

  return (
    <>
      <NextSeo title="Admin Login | Corona Casino" noindex />
      <LoadingBox isSuccess={loginStatus === "success"} isLoading={loginStatus === "loading"} />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          background: `
            radial-gradient(1200px 600px at 10% -10%, rgba(212,175,55,.22), transparent 55%),
            radial-gradient(900px 500px at 100% 0%, rgba(58,134,255,.18), transparent 50%),
            linear-gradient(160deg, #070d18 0%, #0b1528 45%, #101d33 100%)
          `,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            borderRadius: "20px",
            border: "1px solid rgba(212,175,55,.35)",
            background: "linear-gradient(160deg, rgba(22,41,72,.96) 0%, rgba(16,29,51,.98) 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,.45)",
            p: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box sx={{ position: "relative", width: 160, height: 48, mb: 2 }}>
              <Image src={Logo} alt="Corona" fill style={{ objectFit: "contain" }} priority />
            </Box>
            <Typography
              sx={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: ".02em",
              }}
            >
              Admin Portal
            </Typography>
            <Typography sx={{ color: "#b8c0d4", fontSize: "1.4rem", mt: 0.5, textAlign: "center" }}>
              Đăng nhập để quản trị Corona Casino
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <FormControl fullWidth>
              <Typography sx={{ color: "#b8c0d4", mb: 0.5, fontSize: "1.3rem" }}>Tài khoản</Typography>
              <Controller
                name="account"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <OutlinedInput
                    placeholder="Nhập tài khoản admin"
                    size="small"
                    fullWidth
                    error={!!errors.account}
                    inputRef={ref}
                    {...field}
                  />
                )}
              />
              <ErrorMessageLabel>{errors.account?.message || ""}</ErrorMessageLabel>
            </FormControl>

            <FormControl fullWidth>
              <Typography sx={{ color: "#b8c0d4", mb: 0.5, fontSize: "1.3rem" }}>Mật khẩu</Typography>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <OutlinedInput
                    placeholder="Nhập mật khẩu"
                    type={showPassword ? "text" : "password"}
                    size="small"
                    fullWidth
                    error={!!errors.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" sx={{ color: "#b8c0d4" }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    inputRef={ref}
                    {...field}
                  />
                )}
              />
              <ErrorMessageLabel>{errors.password?.message || ""}</ErrorMessageLabel>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                minHeight: 48,
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "1.5rem",
                background: "linear-gradient(90deg, #d4af37 0%, #e5c05b 100%)",
                color: "#0b1528",
                boxShadow: "0 8px 24px rgba(212,175,55,.28)",
                "&:hover": {
                  background: "linear-gradient(90deg, #e5c05b 0%, #f0d78c 100%)",
                },
              }}
            >
              Đăng nhập
            </Button>
          </Box>

          <Typography sx={{ mt: 3, textAlign: "center", color: "rgba(184,192,212,.7)", fontSize: "1.2rem" }}>
            Corona Resort & Casino · Restricted access
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default AdminLogin;
