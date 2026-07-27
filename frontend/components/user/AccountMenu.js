import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AccountMenuItem = styled(Box)(() => ({
  cursor: "pointer",
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  padding: "1.2rem 0.5rem",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  "& svg": {
    color: "#5fb3b3",
  },
  "& .title-menu": {
    fontSize: "1.7rem",
    color: "#fff",
  },
  "&:hover": {
    color: "#e5c05b",
    "& .title-menu": { color: "#e5c05b" },
  },
}));

const listMenu = [
  {
    icon: <HistoryOutlinedIcon />,
    title: "Lịch sử tham gia",
    url: "/participation-history",
  },
  {
    icon: <LocalAtmOutlinedIcon />,
    title: "Biến động số dư",
    url: "/balance-fluctuations",
  },
  {
    icon: <CreditScoreOutlinedIcon />,
    title: "Lịch sử nạp",
    url: "/deposit-history",
  },
  {
    icon: <PaymentsOutlinedIcon />,
    title: "Lịch sử rút",
    url: "/withdraw-history",
  },
  {
    icon: <LockOutlinedIcon />,
    title: "Đổi mật khẩu",
    url: "/change-password",
  },
  {
    icon: <LogoutOutlinedIcon />,
    title: "Đăng xuất",
    url: "/sign-out",
  },
];

const AccountMenu = () => {
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        marginTop: "4rem",
      }}
    >
      {session?.user?.role === "admin" && (
        <Link href={"/admin"}>
          <AccountMenuItem>
            <ManageAccountsIcon />
            <Typography className="title-menu">Quản lý</Typography>
          </AccountMenuItem>
        </Link>
      )}
      {listMenu.map((item) => (
        <Link key={item.url} href={item.url}>
          <AccountMenuItem>
            {item.icon}
            <Typography className="title-menu">{item.title}</Typography>
          </AccountMenuItem>
        </Link>
      ))}
    </Box>
  );
};
export default AccountMenu;
