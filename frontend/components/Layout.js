import useCatchRefreshTokenError from "@/hooks/useCatchRefreshTokenError";
import useRegisterAdminSocket from "@/hooks/useRegisterAdminSocket";
import useRegisterUserSocket from "@/hooks/useRegisterUserSocket";
import { scrubProvideSupportTextLinks } from "@/utils/provideSupport";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "./homePage/Footer";
import Header from "./homePage/Header";

const Layout = ({ children }) => {
  useCatchRefreshTokenError();
  useRegisterUserSocket();
  useRegisterAdminSocket();
  const router = useRouter();
  // Game pages: leave room for sticky bet bar + mobile nav
  const isGamePage = router.pathname.startsWith("/games/");

  useEffect(() => {
    scrubProvideSupportTextLinks();
  }, [router.pathname]);

  return (
    <>
      <Box
        className="App"
        sx={{
          boxShadow: "0 0 4rem 0 rgba(0,0,0,.45)",
          margin: "0 auto",
          maxWidth: "540px",
          minHeight: "100vh",
          background: "var(--bg)",
        }}
      >
        <Box
          className="main"
          sx={{
            background: "linear-gradient(180deg, #101d33 0%, #0b1528 40%, #0b1528 100%)",
            minHeight: "100vh",
            padding: "0 0.32rem 2rem",
            color: "var(--text)",
          }}
        >
          <Header />
          <Box
            sx={{
              padding: "1rem",
              // Sticky bet bar (~12rem) + mobile nav — chỉ chừa cuối trang; bar ẩn khi vào lịch sử
              paddingBottom: isGamePage ? "24rem" : "10rem",
              position: "relative",
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};
export default Layout;
