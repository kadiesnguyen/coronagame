import { Box, Card, Typography } from "@mui/material";

import Image from "next/image";
import Link from "next/link";
import BreadcrumbBar from "../BreadcrumbBar";
const listGame = [
  {
    title: "Keno 1P",
    link: "/admin/games/keno1p",
    icon: "https://i.imgur.com/G8qXjaI.png",
    introduce: "Xem và chỉnh sửa kết quả quay số",
  },
  {
    title: "Keno 3P",
    link: "/admin/games/keno3p",
    icon: "https://i.imgur.com/G8qXjaI.png",
    introduce: "Xem và chỉnh sửa kết quả quay số",
  },
  {
    title: "Keno 5P",
    link: "/admin/games/keno5p",
    icon: "https://i.imgur.com/G8qXjaI.png",
    introduce: "Xem và chỉnh sửa kết quả quay số",
  },
  {
    title: "Xúc Xắc 1P",
    link: "/admin/games/xucxac1p",
    icon: "https://i.imgur.com/Hd9zWRS.png",
    introduce: "Xem và chỉnh sửa kết quả xúc xắc",
  },

  {
    title: "Xúc Xắc 3P",
    link: "/admin/games/xucxac3p",
    icon: "https://i.imgur.com/Hd9zWRS.png",
    introduce: "Xem và chỉnh sửa kết quả xúc xắc",
  },
  {
    title: "Xóc Đĩa 1P",
    link: "/admin/games/xocdia1p",
    icon: "/assets/images/xocdia1p.png",
    introduce: "Xem và chỉnh sửa kết quả xóc đĩa",
  },
  {
    title: "Xổ Số 3P",
    link: "/admin/games/xoso3p",
    icon: "https://i.imgur.com/G8qXjaI.png",
    introduce: "Xem và chỉnh sửa kết quả xổ số",
  },
  {
    title: "Xổ Số 5P",
    link: "/admin/games/xoso5p",
    icon: "https://i.imgur.com/G8qXjaI.png",
    introduce: "Xem và chỉnh sửa kết quả xổ số",
  },
  {
    title: "Xổ Số Miền Bắc",
    link: "/admin/games/xosomb",
    icon: "https://i.imgur.com/G8qXjaI.png",
    introduce: "Xem kết quả xổ số miền bắc",
  },
];
const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý game",
    href: "/admin/games",
  },
];
const Overview = () => {
  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách các game
      </h1>
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

                display: "flex",
                minHeight: "15rem",
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
