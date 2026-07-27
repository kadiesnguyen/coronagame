import Logo from "@/public/assets/images/logo.png";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { FaCreditCard, FaMoneyCheckAlt, FaRocketchat, FaTelegramPlane, FaVolumeOff } from "react-icons/fa";
import SimpleBar from "simplebar-react";
const listItem = [
  {
    key: "/admin/settings",
    value: "Admin",
    icon: <AdminPanelSettingsIcon />,
  },
  {
    key: "/admin/games",
    value: "Quản lý Games",
    icon: <SportsEsportsIcon />,
  },
  {
    key: "/admin/users",
    value: "Quản lý tài khoản",
    icon: <PeopleAltIcon />,
  },
  {
    key: "/admin/settings/deposit",
    value: "Lịch sử nạp",
    icon: <FaMoneyCheckAlt />,
  },
  {
    key: "/admin/settings/notifications",
    value: "Thông báo",
    icon: <FaVolumeOff />,
  },
  {
    key: "/admin/settings/telegram",
    value: "Bot Telegram",
    icon: <FaTelegramPlane />,
  },
  {
    key: "/admin/settings/tawk-to",
    value: "Live chat TawkTo",
    icon: <FaRocketchat />,
  },
  {
    key: "/admin/settings/bank",
    value: "Ngân hàng",
    icon: <FaCreditCard />,
  },
  {
    key: "/admin/withdraw",
    value: "Yêu cầu rút tiền",
    icon: <FaCreditCard />,
  },
];

const Navbar = () => {
  const theme = useTheme();
  const router = useRouter();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [isExpandMenu, setIsExpandMenu] = useState(matches);
  useEffect(() => {
    setIsExpandMenu(matches);
  }, [matches]);
  return (
    <>
      <Box
        component={"nav"}
        sx={{
          display: "flex",
          alignItems: "center",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: isExpandMenu ? "25rem" : "8rem",
          position: "fixed",
          flexDirection: "column",

          transform: "translateX(0)",
          backgroundColor: "#f9f9f9",
          transition: "width 0.05s linear",
        }}
      >
        <ExpandMoreIcon
          onClick={() => setIsExpandMenu(!isExpandMenu)}
          sx={{
            display: { xs: "block", md: "none" },
            width: "3rem",
            height: "3rem",
            color: "black",
            cursor: "pointer",
            backgroundColor: "#e2e0e0",
            position: "absolute",
            zIndex: 99,
            right: "-1.5rem",
            borderRadius: "1rem",
            rotate: isExpandMenu ? "90deg" : "-90deg",
          }}
        ></ExpandMoreIcon>

        <Typography
          className="ms-sidebar__wrapper"
          component="div"
          sx={{
            bgcolor: "header.background.default",
            color: "text.secondary",
            width: "100%",
            padding: "2rem",
          }}
        >
          <Typography
            className="ms-navbar"
            component="div"
            sx={{
              bgcolor: "header.background.default",
              color: "text.secondary",
              gap: "1rem",
            }}
          >
            <Link href="/">
              <Typography
                component="div"
                sx={{
                  height: "5rem",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    display: isExpandMenu ? "block" : "none",
                  }}
                >
                  Megalott
                </Typography>
                <Box
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    position: "relative",
                    display: isExpandMenu ? "none" : "block",
                    margin: "0 auto",
                  }}
                >
                  <Image src={Logo} fill />
                </Box>
              </Typography>
            </Link>

            <SimpleBar style={{ height: "calc(100vh - 10rem)" }}>
              {listItem.map((item, i) => (
                <Link href={item.key} key={i}>
                  <Box
                    sx={{
                      borderRadius: "1rem",
                      marginTop: "1rem",
                      flexDirection: "row",
                      padding: "1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      color: "#1a1a1a",
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      flexWrap: "wrap",
                      opacity: 1,
                      transition: "all 0.2s linear",
                      "&:hover": {
                        backgroundColor: "#e4c9fe",
                        "& .ms-navbar__item--icon, & .ms-navbar__item--title": {
                          color: "text.secondary",
                        },
                      },

                      "&.active": {
                        backgroundColor: "#e4c9fe",
                        "& .ms-navbar__item--icon, & .ms-navbar__item--title": {
                          color: "text.secondary",
                        },
                      },
                    }}
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
                        color: "#737373",
                        fontSize: "2rem",
                        display: "flex",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box
                      className="ms-navbar__item--title"
                      sx={{
                        display: isExpandMenu ? "block" : "none",
                        color: "#737373",
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}
                    </Box>
                  </Box>
                </Link>
              ))}
            </SimpleBar>
          </Typography>
        </Typography>
      </Box>
    </>
  );
};
export default memo(Navbar);
