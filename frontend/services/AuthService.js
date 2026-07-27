import api from "@/configs/axios";

class AuthService {
  static signIn = async ({ taiKhoan, matKhau }) => {
    const result = await api.post(`/v1/nguoidung/sign-in`, {
      taiKhoan,
      matKhau,
    });
    return result;
  };
  static refreshToken = async ({ refreshToken }) => {
    const result = await api.post(`/v1/nguoidung/refresh-token`, {
      refreshToken,
    });
    return result;
  };
  static signUp = async ({ taiKhoan, matKhau, nhapLaiMatKhau }) => {
    const result = await api.post(`/v1/nguoidung/sign-up`, {
      taiKhoan,
      matKhau,
      nhapLaiMatKhau,
    });
    return result;
  };
  static signOut = async ({ refreshToken, taiKhoan }) => {
    const result = await api.post(`/v1/nguoidung/sign-out`, {
      refreshToken,
      taiKhoan,
    });
    return result;
  };
}
export default AuthService;
