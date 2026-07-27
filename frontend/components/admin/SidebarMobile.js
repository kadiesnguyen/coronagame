import { Box, Slide, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FaGamepad, FaHome, FaMoneyCheck, FaMoneyCheckAlt, FaUserAlt } from "react-icons/fa";
const SidebarMobile = (props) => {
  const { data: session, status } = useSession();

  const { handleClickSidebarMobile, isSidebarMobile, handleClickLogout, handleClickSwitch } = props;
  const theme = useTheme();
  const router = useRouter();
  const menuWrapper = useRef();
  const handleClickOutSide = (e) => {
    if (!menuWrapper.current.contains(e.target)) {
      handleClickSidebarMobile();
    }
  };

  const listItem = [
    {
      path: "/",
      title: "Trang chủ",
      icon: <FaHome style={{ fontSize: "1.7rem", fontWeight: "inherit", width: "30px" }} />,
    },
    {
      path: "/admin/settings",
      title: "Admin Panel",
      icon: <FaHome style={{ fontSize: "1.7rem", fontWeight: "inherit", width: "30px" }} />,
    },
    {
      path: "/admin/games",
      title: "Quản lý Game",
      icon: <FaGamepad style={{ fontSize: "1.7rem", fontWeight: "inherit", width: "30px" }} />,
    },
    {
      path: "/admin/users",
      title: "Quản lý User",
      icon: <FaUserAlt style={{ fontSize: "1.7rem", fontWeight: "inherit", width: "30px" }} />,
    },
    {
      path: "/admin/settings/ruttien",
      title: "Yêu cầu rút tiền",
      icon: <FaMoneyCheck style={{ fontSize: "1.7rem", fontWeight: "inherit", width: "30px" }} />,
    },
    {
      path: "/admin/settings/naptien",
      title: "Yêu cầu nạp tiền",
      icon: <FaMoneyCheckAlt style={{ fontSize: "1.7rem", fontWeight: "inherit", width: "30px" }} />,
    },
  ];

  return (
    <>
      <Box
        onClick={(e) => handleClickOutSide(e)}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,.5)",
          zIndex: 1001,
        }}
      >
        <Slide direction="right" in={isSidebarMobile} mountOnEnter unmountOnExit>
          <Box
            ref={menuWrapper}
            sx={{
              position: "absolute",
              backgroundColor: "white",
              height: "100vh",
              width: "300px",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {listItem.map((item) => (
                <Link href={item.path}>
                  <Box
                    sx={{
                      borderRadius: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "5px",
                      fontSize: "25px",
                      fontWeight: "bold",
                      padding: "5px",
                      color: "#333",
                      cursor: "pointer",
                      backgroundColor: router.pathname === item.path ? "#e1e1e175" : null,
                    }}
                    component="div"
                  >
                    {item.icon}
                    <Typography sx={{ fontSize: "1.7rem", fontWeight: "inherit" }} component="span">
                      {item.title}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        </Slide>
      </Box>
    </>
  );
};
export default SidebarMobile;
