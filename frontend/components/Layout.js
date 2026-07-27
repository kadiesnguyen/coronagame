import useCatchRefreshTokenError from "@/hooks/useCatchRefreshTokenError";
import useRegisterUserSocket from "@/hooks/useRegisterUserSocket";
import { Box } from "@mui/material";
import Footer from "./homePage/Footer";
import Header from "./homePage/Header";
import useRegisterAdminSocket from "@/hooks/useRegisterAdminSocket";
const Layout = ({ children }) => {
  useCatchRefreshTokenError();
  useRegisterUserSocket();
  useRegisterAdminSocket();

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
              paddingBottom: "10rem",
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
