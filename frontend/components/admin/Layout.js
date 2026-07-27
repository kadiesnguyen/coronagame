import { Box } from "@mui/material";
import BackToTop from "../homePage/BackToTop";

import useRegisterAdminSocket from "@/hooks/useRegisterAdminSocket";
import useRegisterUserSocket from "@/hooks/useRegisterUserSocket";
import Navbar from "./Navbar";

const Layout = (props) => {
  useRegisterUserSocket();
  useRegisterAdminSocket();
  return (
    <>
      <Navbar />

      <Box
        sx={{
          bgcolor: "#f8fafb",
          color: "#000000",
          paddingLeft: {
            xs: "8rem",
            md: "25rem",
          },
          position: "relative",
        }}
        className="box-container"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "1rem",
            padding: { xs: "8rem 1rem", md: "8rem 2rem" },
          }}
        >
          {props.children}
        </Box>
      </Box>
      <BackToTop />
    </>
  );
};
export default Layout;
