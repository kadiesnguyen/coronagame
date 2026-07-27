import api from "@/configs/axios";
import AuthService from "@/services/AuthService";
import ms from "ms";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
async function refreshAccessToken(tokenObject) {
  try {
    const tokenResponse = await api.post(
      `/v1/nguoidung/refresh-token`,
      {
        refreshToken: tokenObject.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenObject.accessToken}`,
        },
      }
    );
    return {
      ...tokenObject,
      accessToken: tokenResponse.data.data.accessToken,
      refreshToken: tokenResponse.data.data.refreshToken,
      expireAccessToken: tokenResponse.data.data.expireAccessToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "login",

      async authorize(credentials, req) {
        try {
          const { taiKhoan, matKhau } = credentials;
          const loginAccount = await AuthService.signIn({
            taiKhoan,
            matKhau,
          });

          return loginAccount.data.data;
        } catch (err) {
          throw new Error(err?.response?.data?.message ?? `Xảy ra lỗi khi đăng nhập`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = user?.data?.status ?? false;
      if (!isAllowedToSignIn) {
        throw new Error("Tài khoản không có quyền truy cập");
      }
      return isAllowedToSignIn;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      try {
        if (user) {
          const { data, accessToken, refreshToken, expireAccessToken } = user;
          token.taiKhoan = data.taiKhoan;
          token.role = data.role;
          token.id = data._id;
          token.accessToken = accessToken;
          token.expireAccessToken = expireAccessToken;
          token.refreshToken = refreshToken;
        }

        const remainTimeAccessToken = Math.floor((token.expireAccessToken - Date.now()) / 1000);

        const fivePercentRemainTimeAccessToken = Math.floor(
          ((ms(process.env.JWT_ACCESSTOKEN_EXPIRED) / 1000) * 50) / 100
        );
        const isShouldRefreshTime = remainTimeAccessToken <= fivePercentRemainTimeAccessToken;

        // If the token is still valid, just return it.
        if (!isShouldRefreshTime) {
          return Promise.resolve(token);
        }
        token = await refreshAccessToken(token);
        return Promise.resolve(token);
      } catch (err) {
        console.log(err);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, user, token }) {
      session.user.taiKhoan = token.taiKhoan;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.expireAccessToken = token.expireAccessToken;
      session.error = token.error;
      return session;
    },
  },
});
