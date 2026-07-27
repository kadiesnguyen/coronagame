import useGetBranding from "@/hooks/useGetBranding";
import Keno1P from "@/public/assets/images/keno1p.png";
import Keno3P from "@/public/assets/images/keno3p.png";
import Keno5P from "@/public/assets/images/keno5p.png";
import XocDia1P from "@/public/assets/images/xocdia1p.png";
import XoSo3P from "@/public/assets/images/xoso3p.png";
import XoSo5P from "@/public/assets/images/xoso5p.png";
import XucXac1P from "@/public/assets/images/xucxac1p.png";
import XucXac3P from "@/public/assets/images/xucxac3p.png";
import { resolveMediaUrl } from "@/utils/branding";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Layout from "../components/Layout";
import HomeNotification from "../components/homePage/HomeNotification";
import "swiper/css";
const LIST_GAME = [
  {
    title: "Xúc Xắc 10P",
    desc: "Đoán xúc xắc để dành chiến thắng",
    img: XucXac3P,
    link: "/games/xucxac10p",
  },
  {
    title: "Keno 10P",
    desc: "Keno VIP 10 phút",
    img: Keno5P,
    link: "/games/keno10p",
  },
  {
    title: "Xúc Xắc 5P",
    desc: "Đoán xúc xắc để dành chiến thắng",
    img: XucXac3P,
    link: "/games/xucxac5p",
  },
  {
    title: "Xúc Xắc 3P",
    desc: "Đoán xúc xắc để dành chiến thắng",
    img: XucXac3P,
    link: "/games/xucxac3p",
  },
  {
    title: "Xúc Xắc 1P",
    desc: "Đoán xúc xắc để dành chiến thắng",
    img: XucXac1P,
    link: "/games/xucxac1p",
  },
  {
    title: "Keno 5P",
    desc: "Đoán số để dành chiến thắng",
    img: Keno5P,
    link: "/games/keno5p",
  },
  {
    title: "Keno 3P",
    desc: "Đoán số để dành chiến thắng",
    img: Keno3P,
    link: "/games/keno3p",
  },
  {
    title: "Keno 1P",
    desc: "Đoán số để dành chiến thắng",
    img: Keno1P,
    link: "/games/keno1p",
  },
  {
    title: "Xóc Đĩa 1P",
    desc: "Đoán bi để dành chiến thắng",
    img: XocDia1P,
    link: "/games/xocdia1p",
  },
  {
    title: "Xổ Số 3P",
    desc: "Đoán bi để dành chiến thắng",
    img: XoSo3P,
    link: "/games/xoso3p",
  },
  {
    title: "Xổ Số 5P",
    desc: "Đoán bi để dành chiến thắng",
    img: XoSo5P,
    link: "/games/xoso5p",
  },
  {
    title: "Xổ Số Miền Bắc",
    desc: "Đoán bi để dành chiến thắng",
    img: XoSo5P,
    link: "/games/xosomb",
  },
];
const GameItem = styled(Box)(({ theme }) => ({
  marginTop: "10px",
  background: "linear-gradient(145deg, #1a2f4d 0%, #162948 55%, #12243c 100%)",
  border: "1px solid rgba(212, 175, 55, 0.28)",
  borderRadius: "14px",
  padding: "12px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  transition: "border-color .2s ease, transform .15s ease",
  "&:hover": {
    borderColor: "rgba(229, 192, 91, 0.7)",
    transform: "translateY(-1px)",
  },
  "& .desc": {
    display: "flex",
    flexDirection: "column",

    "& .title-game": {
      color: "#fff",
      fontSize: "2rem",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    "& .desc-game": {
      color: "#b8c0d4",
      fontSize: "1.5rem",
    },
  },
  "& img": {
    height: "100%",
    width: "100%",
    maxWidth: "100px",
  },
}));

const Home = () => {
  const { data: branding } = useGetBranding();
  const banners = branding.banners || [];

  return (
    <>
      <Layout>
        <Swiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          style={{
            borderRadius: "10px",
          }}
        >
          {banners.map((item, i) => (
            <SwiperSlide key={`${item.url}-${i}`}>
              <Image
                src={resolveMediaUrl(item.url)}
                alt={item.desc || `banner-${i + 1}`}
                width={1080}
                height={480}
                unoptimized
                priority={i === 0}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Box sx={{}}>
          <HomeNotification />
          <h2 className="title">Games</h2>
          {LIST_GAME.map((item, i) => (
            <Link href={item.link} key={i}>
              <GameItem>
                <Box className="desc">
                  <Typography className="title-game">{item.title}</Typography>
                  <Typography className="desc-game">{item.desc}</Typography>
                </Box>
                <div
                  style={{
                    position: "relative",
                    maxWidth: "10rem",
                    width: "100%",
                  }}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill={true}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </GameItem>
            </Link>
          ))}
        </Box>
      </Layout>
    </>
  );
};

export default Home;
