import Layout from "@/components/Layout";
import RecordBet from "@/components/games/xoso/3p/RecordBet";
import { LOAI_GAME } from "@/configs/game.config";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
const Home = () => {
  const TYPE_GAME = LOAI_GAME.XOSO3P;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Game Xổ Số 3 phút" />

      <Layout>
        <RecordBet TYPE_GAME={TYPE_GAME} />
      </Layout>
    </>
  );
};

export default Home;
