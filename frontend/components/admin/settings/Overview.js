import AdminSection from "@/components/admin/games/AdminSection";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SouthWestOutlinedIcon from "@mui/icons-material/SouthWestOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { Box, Grid, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import BreadcrumbBar from "../BreadcrumbBar";

const User = dynamic(() => import("../dashboard/User"), { ssr: false });
const Deposit = dynamic(() => import("../dashboard/Deposit"), { ssr: false });
const Transaction = dynamic(() => import("../dashboard/GameTransaction"), { ssr: false });

const SETTING_GROUPS = [
  {
    title: "Giao dịch",
    subtitle: "Duyệt & tra cứu nạp / rút",
    items: [
      {
        title: "Yêu cầu nạp",
        link: "/admin/deposit",
        Icon: SouthWestOutlinedIcon,
        accent: "#1fc67c",
        introduce: "Các lệnh nạp đang chờ duyệt",
      },
      {
        title: "Lịch sử nạp",
        link: "/admin/settings/deposit",
        Icon: HistoryOutlinedIcon,
        accent: "#3a86ff",
        introduce: "Các lệnh nạp đã duyệt / từ chối",
      },
      {
        title: "Yêu cầu rút",
        link: "/admin/withdraw",
        Icon: PaymentsOutlinedIcon,
        accent: "#e5c05b",
        introduce: "Các lệnh rút đang chờ duyệt",
      },
      {
        title: "Lịch sử rút",
        link: "/admin/withdraw/history",
        Icon: HistoryOutlinedIcon,
        accent: "#ef6d6d",
        introduce: "Các lệnh rút đã duyệt / từ chối",
      },
    ],
  },
  {
    title: "Cài đặt hệ thống",
    subtitle: "Nội dung, kênh liên lạc & thương hiệu",
    items: [
      {
        title: "Thông báo",
        link: "/admin/settings/notifications",
        Icon: CampaignOutlinedIcon,
        accent: "#e5c05b",
        introduce: "Thông báo hệ thống hiển thị cho user",
      },
      {
        title: "Ngân hàng",
        link: "/admin/settings/bank",
        Icon: AccountBalanceOutlinedIcon,
        accent: "#3a86ff",
        introduce: "Danh sách ngân hàng nhận nạp",
      },
      {
        title: "Telegram",
        link: "/admin/settings/telegram",
        Icon: TelegramIcon,
        accent: "#29b6f6",
        introduce: "Bot thông báo nạp / rút / cược & CSKH",
      },
      {
        title: "CSKH",
        link: "/admin/settings/tawk-to",
        Icon: SupportAgentOutlinedIcon,
        accent: "#1fc67c",
        introduce: "Link hỗ trợ khách hàng trên website",
      },
      {
        title: "Cấu hình VIP",
        link: "/admin/settings/vip",
        Icon: WorkspacePremiumOutlinedIcon,
        accent: "#d4af37",
        introduce: "Ngưỡng số dư VIP Keno 10P",
      },
      {
        title: "Logo & Banner",
        link: "/admin/settings/branding",
        Icon: ImageOutlinedIcon,
        accent: "#c084fc",
        introduce: "Logo header và banner trang chủ",
      },
    ],
  },
  {
    title: "Quản trị",
    subtitle: "Người dùng & game",
    items: [
      {
        title: "Quản lý user",
        link: "/admin/users",
        Icon: PeopleAltOutlinedIcon,
        accent: "#3a86ff",
        introduce: "Tài khoản, số dư, ngân hàng liên kết",
      },
      {
        title: "Danh sách quản trị",
        link: "/admin/settings/admins",
        Icon: AdminPanelSettingsOutlinedIcon,
        accent: "#e5c05b",
        introduce: "Các tài khoản có quyền admin",
      },
      {
        title: "Quản lý game",
        link: "/admin/games",
        Icon: SportsEsportsOutlinedIcon,
        accent: "#1fc67c",
        introduce: "Cấu hình & phiên các game",
      },
    ],
  },
];

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Quản lý", href: "/admin/settings" },
];

const SettingCard = ({ title, introduce, link, Icon, accent }) => (
  <Link href={link} style={{ textDecoration: "none", color: "inherit", minWidth: 0 }}>
    <Box
      sx={{
        height: "100%",
        minHeight: 132,
        cursor: "pointer",
        backgroundColor: "#101d33",
        color: "#fff",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "14px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
        "&:hover": {
          borderColor: `${accent}99`,
          boxShadow: `0 0 0 1px ${accent}33, 0 10px 28px rgba(0,0,0,.35)`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
            background: `radial-gradient(circle at 30% 30%, ${accent}55, transparent 70%), #0b1528`,
            border: `1px solid ${accent}66`,
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.55rem",
            lineHeight: 1.25,
            color: "#fff",
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "1.3rem", color: "#b8c0d4", lineHeight: 1.4 }}>{introduce}</Typography>
    </Box>
  </Link>
);

const Overview = () => {
  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />

      <Box sx={{ mb: "8px" }}>
        <Typography
          sx={{
            fontSize: { xs: "2.2rem", md: "2.6rem" },
            fontWeight: 800,
            color: "#e5c05b",
            lineHeight: 1.2,
          }}
        >
          Tổng quan hệ thống
        </Typography>
        <Typography sx={{ fontSize: "1.35rem", color: "#b8c0d4", mt: "4px" }}>
          Thống kê 7 ngày gần nhất · Truy cập nhanh cài đặt
        </Typography>
      </Box>

      <AdminSection title="Thống kê 7 ngày" subtitle="User mới · Nạp tiền · Giao dịch game" sx={{ mb: "24px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <User />
          </Grid>
          <Grid item xs={12} md={4}>
            <Deposit />
          </Grid>
          <Grid item xs={12} md={4}>
            <Transaction />
          </Grid>
        </Grid>
      </AdminSection>

      {SETTING_GROUPS.map((group) => (
        <AdminSection key={group.title} title={group.title} subtitle={group.subtitle} sx={{ mb: "24px" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
              gap: "12px",
            }}
          >
            {group.items.map((item) => (
              <SettingCard key={item.link + item.title} {...item} />
            ))}
          </Box>
        </AdminSection>
      ))}
    </>
  );
};

export default Overview;
