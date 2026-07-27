import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaBlog } from "react-icons/fa";
import { MdSource } from "react-icons/md";
const Navbar = (props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const handleClickSupport = () => {
    setIsModal(true);
  };

  const BoxMenuNavBar = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.header.background.default,

    borderRight: theme.palette.mode === "light" ? "1px solid #dcdee0" : "1px solid #4b4c4e",
  }));
  const MenuNavBarItem = styled(Box)(({ theme }) => ({
    flexDirection: "column",
    width: "80px",
    height: "80px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    opacity: 0.85,
    backgroundColor: theme.palette.navItem.background,

    "&:hover": {
      backgroundColor: theme.palette.navItem.hover,
      borderRadius: "20px",
    },

    "&.active": {
      backgroundColor: theme.palette.navItem.active,
      borderRadius: "20px",
    },
  }));
  const listItem = [
    {
      key: "/",
      value: "Home",
      icon: <AiFillHome />,
    },
    {
      key: "/source-code",
      value: "Source",
      icon: <MdSource />,
    },
    {
      key: "/blog",
      value: "Blog",
      icon: <FaBlog />,
    },
  ];

  return (
    <>
      <BoxMenuNavBar
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
        }}
        className="ms-sidebar"
      >
        <Typography
          className="ms-sidebar__wrapper"
          component="div"
          sx={{
            bgcolor: "header.background.default",
            color: "text.primary",
          }}
        >
          <Typography
            className="ms-navbar"
            component="div"
            sx={{
              bgcolor: "header.background.default",
              color: "text.primary",
            }}
          >
            {listItem.map((item, i) => (
              <Link href={item.key} key={i}>
                <MenuNavBarItem
                  className={
                    i > 0 && router.pathname.startsWith(item.key)
                      ? `active`
                      : i === 0 && router.pathname === item.key
                      ? `active`
                      : null
                  }
                >
                  <Box
                    className="ms-navbar__item--icon"
                    sx={{
                      color: "text.primary",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box
                    className="ms-navbar__item--title"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                    }}
                  >
                    {item.value}
                  </Box>
                </MenuNavBarItem>
              </Link>
            ))}

            {session && session.user.role === "admin" && (
              <Link href="/admin">
                <MenuNavBarItem
                  className={
                    router.pathname === "/admin" ? `ms-navbar__item active_${theme.palette.mode}` : "ms-navbar__item"
                  }
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <Box
                    className="ms-navbar__item--icon"
                    sx={{
                      color: "text.primary",
                    }}
                  >
                    <AdminPanelSettingsIcon />
                  </Box>
                  <Box
                    className="ms-navbar__item--title"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                    }}
                  >
                    Admin
                  </Box>
                </MenuNavBarItem>
              </Link>
            )}
          </Typography>
        </Typography>
      </BoxMenuNavBar>
    </>
  );
};
export default Navbar;
