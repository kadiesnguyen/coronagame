import Logo from "@/public/assets/images/logo.png";
import { KEYS_SOCKET_ADMIN } from "@/configs/admin.socket.config";
import SocketContext from "@/context/socket";
import useGetCountAllDepositHistory from "@/hooks/admin/useGetCountAllDepositHistory";
import useGetCountAllWithdrawHistory from "@/hooks/admin/useGetCountAllWithdrawHistory";
import { getTotalUnreadGameBets } from "@/utils/adminGameBetBadge";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Badge, Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { FaCreditCard, FaMoneyCheckAlt, FaRocketchat, FaTelegramPlane, FaVolumeOff } from "react-icons/fa";
import { useSelector } from "react-redux";
import SimpleBar from "simplebar-react";

const topItemsBase = [
  { key: "/admin/settings", value: "Admin", icon: <AdminPanelSettingsIcon />, exact: true },
  { key: "/admin/games", value: "Quản lý Games", icon: <SportsEsportsIcon />, badgeKey: "games" },
  { key: "/admin/users", value: "Quản lý tài khoản", icon: <PeopleAltIcon /> },
];

const giaoDichChildrenBase = [
  { key: "/admin/withdraw", value: "Yêu cầu rút tiền", icon: <FaCreditCard />, match: "withdraw-pending", badgeKey: "withdraw" },
  { key: "/admin/withdraw/history", value: "Lịch sử rút", icon: <FaCreditCard />, match: "withdraw-history" },
  { key: "/admin/deposit", value: "Yêu cầu nạp", icon: <FaMoneyCheckAlt />, match: "deposit-pending", badgeKey: "deposit" },
  { key: "/admin/settings/deposit", value: "Lịch sử nạp", icon: <FaMoneyCheckAlt />, match: "deposit-history" },
];

const caiDatChildren = [
  { key: "/admin/settings/notifications", value: "Thông báo", icon: <FaVolumeOff /> },
  { key: "/admin/settings/telegram", value: "Bot Telegram", icon: <FaTelegramPlane /> },
  { key: "/admin/settings/tawk-to", value: "Cài đặt cskh", icon: <FaRocketchat /> },
  { key: "/admin/settings/vip", value: "Cấu hình VIP", icon: <AdminPanelSettingsIcon /> },
  { key: "/admin/settings/branding", value: "Logo & Banner", icon: <FaCreditCard /> },
  { key: "/admin/settings/bank", value: "Ngân hàng", icon: <FaCreditCard /> },
  { key: "/admin/settings/admins", value: "Danh sách quản trị", icon: <AdminPanelSettingsIcon /> },
];

const isItemActive = (pathname, item) => {
  if (item.match === "withdraw-pending") {
    return pathname === "/admin/withdraw" || /^\/admin\/withdraw\/[^/]+$/.test(pathname);
  }
  if (item.match === "withdraw-history") {
    return pathname.startsWith("/admin/withdraw/history");
  }
  if (item.match === "deposit-pending") {
    return pathname === "/admin/deposit" || pathname.startsWith("/admin/deposit/");
  }
  if (item.match === "deposit-history") {
    return pathname.startsWith("/admin/settings/deposit");
  }
  if (item.exact) return pathname === item.key;
  return pathname === item.key || pathname.startsWith(`${item.key}/`);
};

const CountBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <Badge
      badgeContent={count > 99 ? "99+" : count}
      color="error"
      sx={{
        "& .MuiBadge-badge": {
          position: "static",
          transform: "none",
          fontSize: "1.05rem",
          fontWeight: 800,
          minWidth: 20,
          height: 20,
          backgroundColor: "#ef6d6d",
        },
      }}
    />
  );
};

const NavLink = ({ item, isExpandMenu, active, badgeCount = 0 }) => (
  <Link href={item.key}>
    <Box
      className={active ? "active" : null}
      sx={{
        borderRadius: "1rem",
        flexDirection: "row",
        padding: "14px 16px",
        minHeight: "48px",
        fontWeight: 700,
        fontSize: "1.7rem",
        lineHeight: 1.3,
        cursor: "pointer",
        color: "#e8eefc",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "all 0.2s linear",
        "&:hover": {
          backgroundColor: "rgba(212,175,55,.18)",
          color: "#e5c05b",
        },
        "&.active": {
          backgroundColor: "rgba(212,175,55,.28)",
          color: "#e5c05b",
        },
        "& .MuiSvgIcon-root": {
          fontSize: "2.4rem",
        },
      }}
    >
      <Box sx={{ position: "relative", fontSize: "2.4rem", display: "flex", alignItems: "center", color: "inherit", flexShrink: 0 }}>
        {item.icon}
        {!isExpandMenu && badgeCount > 0 ? (
          <Box
            sx={{
              position: "absolute",
              top: -4,
              right: -6,
              minWidth: 16,
              height: 16,
              px: "4px",
              borderRadius: "999px",
              backgroundColor: "#ef6d6d",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </Box>
        ) : null}
      </Box>
      <Box
        sx={{
          display: isExpandMenu ? "flex" : "none",
          fontWeight: 700,
          fontSize: "inherit",
          color: "inherit",
          whiteSpace: "nowrap",
          alignItems: "center",
          gap: "8px",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.value}
        </Box>
        <CountBadge count={badgeCount} />
      </Box>
    </Box>
  </Link>
);

const NavGroup = ({ title, items, isExpandMenu, pathname, badges }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {isExpandMenu && (
      <Typography
        sx={{
          px: "16px",
          pt: "8px",
          fontSize: "1.3rem",
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#e5c05b",
        }}
      >
        {title}
      </Typography>
    )}
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", pl: isExpandMenu ? "8px" : 0 }}>
      {items.map((item) => (
        <NavLink
          key={item.key}
          item={item}
          isExpandMenu={isExpandMenu}
          active={isItemActive(pathname, item)}
          badgeCount={item.badgeKey ? badges[item.badgeKey] || 0 : 0}
        />
      ))}
    </Box>
  </Box>
);

const Navbar = () => {
  const theme = useTheme();
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [isExpandMenu, setIsExpandMenu] = useState(matches);
  const { data: pendingDeposit = 0, refetch: refetchDeposit } = useGetCountAllDepositHistory({
    statusGroup: "pending",
  });
  const { data: pendingWithdraw = 0, refetch: refetchWithdraw } = useGetCountAllWithdrawHistory({
    statusGroup: "pending",
  });
  const gameBetAlerts = useSelector((state) => state.admin.GAME_BET_ALERTS || {});
  const gameBetSeen = useSelector((state) => state.admin.GAME_BET_SEEN || {});

  const gamesUnreadBets = useMemo(
    () => getTotalUnreadGameBets(gameBetAlerts, gameBetSeen),
    [gameBetAlerts, gameBetSeen]
  );

  const badges = useMemo(
    () => ({
      deposit: Number(pendingDeposit) || 0,
      withdraw: Number(pendingWithdraw) || 0,
      games: gamesUnreadBets,
    }),
    [pendingDeposit, pendingWithdraw, gamesUnreadBets]
  );

  useEffect(() => {
    setIsExpandMenu(matches);
  }, [matches]);

  useEffect(() => {
    if (!socket) return undefined;
    const refresh = () => {
      refetchDeposit();
      refetchWithdraw();
    };
    socket.on(KEYS_SOCKET_ADMIN.NEW_REQUEST, refresh);
    const timer = setInterval(refresh, 30000);
    return () => {
      socket.off(KEYS_SOCKET_ADMIN.NEW_REQUEST, refresh);
      clearInterval(timer);
    };
  }, [socket, refetchDeposit, refetchWithdraw]);

  return (
    <Box
      component={"nav"}
      sx={{
        display: "flex",
        alignItems: "center",
        zIndex: (t) => t.zIndex.drawer + 1,
        width: isExpandMenu ? "25rem" : "8rem",
        position: "fixed",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#101d33",
        borderRight: "1px solid rgba(212,175,55,.25)",
        transition: "width 0.05s linear",
      }}
    >
      <ExpandMoreIcon
        onClick={() => setIsExpandMenu(!isExpandMenu)}
        sx={{
          display: { xs: "block", md: "none" },
          width: "3rem",
          height: "3rem",
          color: "#e5c05b",
          cursor: "pointer",
          backgroundColor: "#162948",
          position: "absolute",
          zIndex: 99,
          right: "-1.5rem",
          borderRadius: "1rem",
          rotate: isExpandMenu ? "90deg" : "-90deg",
        }}
      />

      <Box sx={{ width: "100%", padding: "2rem", color: "#ffffff" }}>
        <Link href="/">
          <Box
            sx={{
              position: "relative",
              width: isExpandMenu ? "16rem" : "3.5rem",
              height: isExpandMenu ? "3.4rem" : "3.5rem",
              margin: isExpandMenu ? 0 : "0 auto",
              cursor: "pointer",
            }}
          >
            <Image src={Logo} alt="Corona" fill style={{ objectFit: "contain" }} />
          </Box>
        </Link>

        <SimpleBar style={{ height: "calc(100vh - 10rem)", marginTop: "1.5rem" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "2rem" }}>
            {topItemsBase.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                isExpandMenu={isExpandMenu}
                active={isItemActive(router.pathname, item)}
                badgeCount={item.badgeKey ? badges[item.badgeKey] || 0 : 0}
              />
            ))}
            <NavGroup
              title="Giao dịch"
              items={giaoDichChildrenBase}
              isExpandMenu={isExpandMenu}
              pathname={router.pathname}
              badges={badges}
            />
            <NavGroup
              title="Cài đặt"
              items={caiDatChildren}
              isExpandMenu={isExpandMenu}
              pathname={router.pathname}
              badges={badges}
            />
          </Box>
        </SimpleBar>
      </Box>
    </Box>
  );
};

export default memo(Navbar);
