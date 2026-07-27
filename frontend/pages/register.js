import Layout from "@/components/Layout";
import Button from "@/components/button/Button";
import LoadingBox from "@/components/homePage/LoadingBox";
import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_ACCOUNT, MIN_LENGTH_PASSWORD } from "@/configs/user.config";
import AuthService from "@/services/AuthService";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, FormControl } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { signIn, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
const DangKy = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [signupStatus, setSignupStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // form validation rules
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
    confirmPassword: Yup.string()
      .required("Vui lòng nhập nhập lại mật khẩu")
      .min(MIN_LENGTH_PASSWORD, `Nhập lại mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`)
      .trim("Nhập lại mật khẩu không hợp lệ")
      .matches(/^\S*$/, "Nhập lại mật khẩu không hợp lệ")
      .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp với nhau")
      .strict(true),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  const onSubmit = async (data) => {
    try {
      setSignupStatus("loading");
      const { account, password, confirmPassword } = data;
      const result = await AuthService.signUp({
        taiKhoan: account,
        matKhau: password,
        nhapLaiMatKhau: confirmPassword,
      });

      toast.success(result?.data?.message ?? "Đăng ký tài khoản thành công");

      setSignupStatus("success");
      reset();
      // Đăng nhập tự động
      await signIn("login", {
        taiKhoan: account,
        matKhau: password,
        redirect: false,
        callbackUrl: "/",
      });
    } catch (err) {
      setSignupStatus("error");
      toast.error(err?.response?.data?.message ?? "Có lỗi khi đăng ký tài khoản");
    } finally {
      setSignupStatus(null);
    }
  };

  return (
    <>
      <NextSeo title="Tạo tài khoản" />
      <LoadingBox isSuccess={signupStatus === "success"} isLoading={signupStatus === "loading"} />
      <Layout>
        <h1 className="title-h1">Đăng ký</h1>

        <form
          style={{
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1.5rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="account"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Tài khoản"
                  size="small"
                  fullWidth
                  error={errors.account ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.account ? errors.account.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            ></Box>
            <Controller
              name="password"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  fullWidth
                  error={errors.password ? true : false}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.password ? errors.password.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            ></Box>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Mật khẩu"
                  type={showConfirmPassword ? "text" : "password"}
                  size="small"
                  fullWidth
                  error={errors.confirmPassword ? true : false}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.confirmPassword ? errors.confirmPassword.message : ""}</ErrorMessageLabel>
          </FormControl>
          <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
            Đăng ký
          </Button>
        </form>
      </Layout>
    </>
  );
};

export default DangKy;
