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
          boxShadow: "0 0 6rem 0 hsla(0,0%,49%,.3)",
          margin: "0 auto",
          maxWidth: "540px",
          minHeight: "100vh",
        }}
      >
        <Box
          className="main"
          sx={{
            background: "#fff7f7",
            minHeight: "100vh",
            padding: "0 0.32rem 2rem",
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
