import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import GameAdminShell from "@/components/admin/games/GameAdminShell";
import AdminSettingsGrid from "@/components/admin/games/AdminSettingsGrid";
import DieuChinhAuto from "@/components/admin/games/xucxac/DieuChinhAuto";
import DieuChinhTiLe from "@/components/admin/games/xucxac/DieuChinhTiLe";
import ListGame from "@/components/admin/games/xucxac/ListGame";
import LivePhienPanel from "@/components/admin/games/xucxac/LivePhienPanel";
import { LOAI_GAME, convertLoaiGame } from "@/configs/game.config";
import { NextSeo } from "next-seo";
const Home = () => {
  const TYPE_GAME = LOAI_GAME.XUCXAC10P;
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
  ];
  return (
    <>
      <NextSeo title={`Quản lý game ${convertLoaiGame(TYPE_GAME)}`} />

      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <GameAdminShell typeGame={TYPE_GAME} description="Phiên live · lịch sử phiên · tỉ lệ · auto">
          <AdminSettingsGrid>
            <DieuChinhTiLe TYPE_GAME={TYPE_GAME} />
            <DieuChinhAuto TYPE_GAME={TYPE_GAME} />
          </AdminSettingsGrid>
          <LivePhienPanel TYPE_GAME={TYPE_GAME} />
          <ListGame TYPE_GAME={TYPE_GAME} infoOnlyWhenFinished />
        </GameAdminShell>
      </Layout>
    </>
  );
};
export default Home;
