import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import ChiTietPhien from "@/components/admin/games/keno/ChiTietPhien";
import LichSuCuoc from "@/components/admin/games/keno/LichSuCuoc";
import LichSuCuocCharts from "@/components/admin/games/keno/LichSuCuocCharts";
import { LOAI_GAME, convertLoaiGame } from "@/configs/game.config";
import { NextSeo } from "next-seo";
const ChiTiet = ({ ID }) => {
  const TYPE_GAME = LOAI_GAME.KENO5P;
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
        <ChiTietPhien ID={ID} TYPE_GAME={TYPE_GAME} />
        <LichSuCuocCharts ID={ID} TYPE_GAME={TYPE_GAME} />
        <LichSuCuoc ID={ID} TYPE_GAME={TYPE_GAME} />
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
