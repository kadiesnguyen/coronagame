import AuthService from "@/services/AuthService";
import { signOut } from "next-auth/react";

const handleLogout = async (session, callbackUrl = "/") => {
  await Promise.all([
    AuthService.signOut({
      refreshToken: session?.user?.refreshToken,
      taiKhoan: session?.user?.taiKhoan,
    }).catch(() => null),
    signOut({
      redirect: true,
      callbackUrl,
    }),
  ]);
};
export default handleLogout;
