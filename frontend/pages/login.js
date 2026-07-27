import Layout from "@/components/Layout";
import Button from "@/components/button/Button";
import LoadingBox from "@/components/homePage/LoadingBox";
import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_ACCOUNT, MIN_LENGTH_PASSWORD } from "@/configs/user.config";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, IconButton, InputAdornment } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { callbackUrl } = router.query;
  const [loginStatus, setLoginStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      router.push(callbackUrl ?? "/");
    }
  }, [status]);

  const onSubmit = async (data) => {
    try {
      setLoginStatus("loading");
      const { account, password } = data;
      const result = await signIn("login", {
        taiKhoan: account,
        matKhau: password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result.error) {
        throw new Error(result?.error ?? "Có lỗi xảy ra khi đăng nhập");
      }
      setLoginStatus("success");
    } catch (err) {
      toast.error(err?.message);
      console.log(err);
    } finally {
      setLoginStatus(null);
    }
  };

  return (
    <>
      <NextSeo title="Đăng nhập tài khoản" />
      <LoadingBox isSuccess={loginStatus === "success"} isLoading={loginStatus === "loading"} />
      <Layout>
        <h1 className="title-h1">Đăng nhập</h1>

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
          <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
            Đăng nhập
          </Button>
        </form>
      </Layout>
    </>
  );
};

export default Login;
