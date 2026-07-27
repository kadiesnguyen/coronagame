import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BookIcon from "@mui/icons-material/Book";
import HomeIcon from "@mui/icons-material/Home";
import InputIcon from "@mui/icons-material/Input";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SourceIcon from "@mui/icons-material/Source";
import { Box, IconButton, Slide, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
const SidebarMobile = (props) => {
  const { session, status, handleClickSidebarMobile, isSidebarMobile, setIsSidebarMobile } = props;

  const theme = useTheme();
  const router = useRouter();
  const menuWrapper = useRef();
  const [value, setValue] = useState("/");
  useEffect(() => {
    if (router.pathname === "/") {
      setValue("/");
    } else if (router.pathname.startsWith("/source-code")) {
      setValue("/source-code");
    } else if (router.pathname.startsWith("/blog")) {
      setValue("/blog");
    } else if (router.pathname.startsWith("/admin")) {
      setValue("/admin");
    } else {
      setValue(router.pathname);
    }
  }, [router.pathname]);

  const menuOption = [
    {
      key: "/",
      title: "Home",
      type: 0,
      icon: <HomeIcon />,
    },
    {
      key: "/source-code",
      title: "Source",
      type: 0,
      icon: <SourceIcon />,
    },
    {
      key: "/blog",
      title: "Blog",
      type: 0,
      icon: <BookIcon />,
    },
    {
      key: "/login",
      title: "Login",
      type: 1,
      icon: <LoginIcon />,
    },
    {
      key: "/signup",
      title: "Signup",
      type: 1,
      icon: <InputIcon />,
    },
    {
      key: "/logout",
      title: "Logout",
      type: 2,
      icon: <LogoutIcon />,
    },
    {
      key: "/admin",
      title: "Admin",
      type: 3,
      icon: <AdminPanelSettingsIcon />,
    },
  ];

  return (
    <>
      <Slide direction="right" in={isSidebarMobile} mountOnEnter unmountOnExit>
        <Box
          ref={menuWrapper}
          sx={{
            position: "fixed",
            backgroundColor: (theme) => theme.palette.sidebarMobile.background.default,
            height: "100vh",
            width: "300px",
            padding: "20px",
            zIndex: 1001,
          }}
        >
          <IconButton
            onClick={() => setIsSidebarMobile(false)}
            sx={{
              position: "absolute",
              width: "40px",
              height: "40px",
              top: "20px",
              right: "0px",
            }}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              color: (theme) => theme.palette.text.first,
            }}
          >
            {menuOption.map((item, i) => {
              if (item.type === 0) {
                return (
                  <Link href={item.key} key={item.key}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "5px",
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        padding: "5px",
                        textTransform: "capitalize",

                        backgroundColor:
                          value === item.key ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive : null,
                        padding: "10px",
                        borderRadius: "5px",
                        cursor: "pointer",

                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "1.5rem",
                          marginRight: "5px",
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Typography
                        sx={{
                          display: "flex",
                          fontSize: "2rem",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  </Link>
                );
              } else if (item.type === 1) {
                if (status === "unauthenticated") {
                  return (
                    <Link href={item.key} key={item.key}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "5px",
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          padding: "5px",
                          textTransform: "capitalize",

                          backgroundColor:
                            value === item.key
                              ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                              : null,
                          padding: "10px",
                          borderRadius: "5px",
                          cursor: "pointer",

                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "1.5rem",
                            marginRight: "5px",
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Typography
                          sx={{
                            display: "flex",
                            fontSize: "2rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Link>
                  );
                }
              } else if (item.type === 2) {
                if (status === "authenticated") {
                  return (
                    <Link href={item.key} key={item.key}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "5px",
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          padding: "5px",
                          textTransform: "capitalize",

                          backgroundColor:
                            value === item.key
                              ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                              : null,
                          padding: "10px",
                          borderRadius: "5px",
                          cursor: "pointer",

                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "1.5rem",
                            marginRight: "5px",
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Typography
                          sx={{
                            display: "flex",
                            fontSize: "2rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Link>
                  );
                }
              } else if (item.type === 3) {
                if (status === "authenticated" && session.user.role === "admin") {
                  return (
                    <Link href={item.key} key={item.key}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "5px",
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          padding: "5px",
                          textTransform: "capitalize",

                          backgroundColor:
                            value === item.key
                              ? (theme) => theme.palette.sidebarMobile.item.backgroundColorActive
                              : null,
                          padding: "10px",
                          borderRadius: "5px",
                          cursor: "pointer",

                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.sidebarMobile.item.backgroundColorHover,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "1.5rem",
                            marginRight: "5px",
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Typography
                          sx={{
                            display: "flex",
                            fontSize: "2rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Link>
                  );
                }
              }
            })}
          </Box>
        </Box>
      </Slide>
    </>
  );
};
export default SidebarMobile;
