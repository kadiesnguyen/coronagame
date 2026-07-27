import { Box } from "@mui/material";
import BackToTop from "../homePage/BackToTop";

import useRegisterAdminSocket from "@/hooks/useRegisterAdminSocket";
import useRegisterUserSocket from "@/hooks/useRegisterUserSocket";
import AdminAccountMenu from "./AdminAccountMenu";
import AdminNotificationBell from "./AdminNotificationBell";
import Navbar from "./Navbar";

const Layout = (props) => {
  useRegisterUserSocket();
  useRegisterAdminSocket();
  return (
    <>
      <Navbar />

      <Box
        sx={{
          bgcolor: "#0b1528",
          color: "#ffffff",
          minHeight: "100vh",
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
            position: "sticky",
            top: 0,
            zIndex: (t) => t.zIndex.appBar,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            minHeight: 56,
            px: { xs: "12px", md: "20px" },
            py: "8px",
            background: "linear-gradient(180deg, rgba(11,21,40,.96) 0%, rgba(11,21,40,.75) 70%, rgba(11,21,40,0) 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AdminNotificationBell />
            <AdminAccountMenu />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "#0b1528",
            justifyContent: "center",
            color: "#ffffff",
            gap: "1rem",
            padding: { xs: "1rem 1rem 8rem", md: "1rem 2rem 8rem" },
            width: "100%",
            minWidth: 0,
            overflowX: "hidden",
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
