import { Box, Card, Grid, Typography } from "@mui/material";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbBar from "../BreadcrumbBar";
const User = dynamic(() => import("../dashboard/User"), { ssr: false });
const Deposit = dynamic(() => import("../dashboard/Deposit"), { ssr: false });
const Transaction = dynamic(() => import("../dashboard/GameTransaction"), { ssr: false });

const listGame = [
  {
    title: "QUẢN LÝ NGÂN HÀNG",
    link: "/admin/settings/bank",
    icon: "https://i.imgur.com/HeeXUhh.png",
    introduce: "Chỉnh sửa danh sách ngân hàng để user nạp tiền",
  },
  {
    title: "THÔNG BÁO",
    link: "/admin/settings/notifications",
    icon: "https://i.imgur.com/nmkGJFj.png",
    introduce: "Chỉnh sửa thông báo hệ thống",
  },
  {
    title: "LỊCH SỬ NẠP TIỀN",
    link: "/admin/settings/deposit",
    icon: "https://i.imgur.com/XrPK4jK.png",
    introduce: "Xem các yêu cầu nạp tiền",
  },
  {
    title: "QUẢN LÝ USER",
    link: "/admin/users",
    icon: "https://i.imgur.com/iSdVffh.png",
    introduce: "Quản lý người dùng",
  },
  {
    title: "QUẢN LÝ GAME",
    link: "/admin/games",
    icon: "https://i.imgur.com/Z8wX9uM.png",
    introduce: "Quản lý các game",
  },
  {
    title: "CẤU HÌNH TELEGRAM",
    link: "/admin/settings/telegram",
    icon: "https://i.imgur.com/qF3giFS.png",
    introduce: "Cấu hình telegram bao gồm BOT gửi message khi có có yêu cầu rút, nạp, đặt cược; CSKH",
  },
  {
    title: "CẤU HÌNH CSKH TAWK.TO",
    link: "/admin/settings/tawk-to",
    icon: "https://i.imgur.com/K5Lnk4O.png",
    introduce: "Cấu hình CSKH Live chat TawkTo",
  },
  {
    title: "YÊU CẦU RÚT TIỀN",
    link: "/admin/withdraw",
    icon: "https://i.imgur.com/rze2jG8.png",
    introduce: "Xem các yêu cầu rút tiền",
  },
];

const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý",
    href: "/admin/settings",
  },
];

const Overview = () => {
  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Thống kê 7 ngày gần nhất
      </h2>

      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4}>
          <User />
        </Grid>
        <Grid item xs={4}>
          <Deposit />
        </Grid>
        <Grid item xs={4}>
          <Transaction />
        </Grid>
      </Grid>
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Quản lý hệ thống
      </h2>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0,1fr))",

            sm: "repeat(2, minmax(0,1fr))",
            md: "repeat(3, minmax(0,1fr))",

            lg: "repeat(4, minmax(0,1fr))",
            xl: "repeat(5, minmax(0,1fr))",
          },
          gap: "2rem",
        }}
      >
        {listGame.map((item, i) => (
          <Link href={item.link} key={i}>
            <Card
              sx={{
                cursor: "pointer",
                backgroundColor: "#ffffff",
                color: "#201c58",
                minHeight: "15rem",

                display: "flex",

                padding: "1.5rem",

                boxShadow: "-1px 2px 14px 5px #edf0f8",
                borderRadius: "3rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",

                  width: "100%",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "4rem",
                    height: "4rem",
                    position: "relative",
                  }}
                >
                  <Image src={item.icon} layout="fill" />
                </Box>

                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "1.5rem",
                  }}
                >
                  {item.introduce}
                </Typography>
              </Box>
            </Card>
          </Link>
        ))}
      </Box>
    </>
  );
};
export default Overview;
