import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useMemo, useState } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SourceIcon from "@mui/icons-material/Source";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
const Sidebar = (props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuUser = Boolean(anchorEl);

  const { handleClickSidebarMobile, handleClickSwitch, handleClickLogout } = props;
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClickLogoutMiddle = () => {
    handleClickLogout();
    handleCloseUserMenu();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "header.background.default",
          padding: "10px",
          justifyContent: "space-between",
          color: "text.primary",
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          height: "70px",
        }}
      >
        <Typography
          sx={{
            paddingLeft: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
          component="div"
        >
          <Link href="/">
            <Button>
              <Avatar
                src="https://i.imgur.com/U0BdIic.png"
                variant="square"
                sx={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            </Button>
          </Link>
          <IconButton onClick={handleClickSidebarMobile}>
            <MenuIcon
              sx={{
                display: { xs: "block", md: "none" },
              }}
            />
          </IconButton>
          <Link href="/about-me">
            <Button
              sx={{
                fontWeight: "bold",
                height: "30px",
                padding: "5px",
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              About me
            </Button>
          </Link>
          <Link href="/source-code">
            <Button
              sx={{
                fontWeight: "bold",
                height: "30px",
                padding: "5px",
                borderRadius: "10px",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              Source
            </Button>
          </Link>
        </Typography>
        <Typography
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}
          component="div"
        >
          <IconButton sx={{ ml: 1 }} onClick={handleClickSwitch} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {status === "authenticated" && (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={(e) => handleOpenUserMenu(e)}>
                  <Avatar alt={session.user.account}>{session.user.account.charAt(0)}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={isMenuUser}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography textAlign="center">Upload</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center" onClick={handleClickLogoutMiddle}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Typography>
      </Box>
    </>
  );
};
export default Sidebar;
