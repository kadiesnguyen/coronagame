import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AccountMenuItem = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  borderBottom: "1px solid #ccc",
  color: theme.palette.text.secondary,
  "& svg": {
    color: theme.palette.color.primary,
  },
  "& .title-menu": {
    fontSize: "1.7rem",
  },
}));
const listMenu = [
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
    icon: <AccountBalanceOutlinedIcon />,
    title: "Liên kết ngân hàng",
    url: "/list-bank",
  },
  {
    icon: <LogoutOutlinedIcon />,
    title: "Đăng xuất",
    url: "/sign-out",
  },
];
const AccountMenu = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          marginTop: "4rem",
        }}
      >
        {session && session.user && session.user.role === "admin" && (
          <Link href={"/admin"}>
            <AccountMenuItem>
              <ManageAccountsIcon />
              <Typography className="title-menu">Quản lý</Typography>
            </AccountMenuItem>
          </Link>
        )}
        {listMenu.map((item, i) => (
          <Link key={i} href={item.url}>
            <AccountMenuItem>
              {item.icon}
              <Typography className="title-menu">{item.title}</Typography>
            </AccountMenuItem>
          </Link>
        ))}
      </Box>
    </>
  );
};
export default AccountMenu;
