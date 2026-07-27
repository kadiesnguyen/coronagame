import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import ChiTietPhien from "@/components/admin/games/keno/ChiTietPhien";
import LichSuCuoc from "@/components/admin/games/keno/LichSuCuoc";
import { LOAI_GAME, convertLoaiGame } from "@/configs/game.config";
import { Box } from "@mui/material";
import { NextSeo } from "next-seo";

const ChiTiet = ({ ID }) => {
  const TYPE_GAME = LOAI_GAME.KENO10P;
  const BreadcrumbData = [
    {
      title: "Admin",
      href: "/admin",
    },
    {
      title: "Games",
      href: "/admin/games",
    },
    {
      title: convertLoaiGame(TYPE_GAME),
      href: `/admin/games/${TYPE_GAME}`,
    },
    {
      title: "Chi tiết",
      href: `/admin/games/${TYPE_GAME}/${ID}`,
    },
  ];

  return (
    <>
      <NextSeo title={`Chi tiết game ${convertLoaiGame(TYPE_GAME)}`} />

      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
          <ChiTietPhien ID={ID} TYPE_GAME={TYPE_GAME} />
          <LichSuCuoc ID={ID} TYPE_GAME={TYPE_GAME} />
        </Box>
      </Layout>
    </>
  );
};
export default ChiTiet;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const ID = params.id;

  return {
    props: {
      ID: ID,
    },
  };
};
