import Layout from "@/components/Layout";
import RecordBet from "@/components/games/xucxac/1p/RecordBet";
import BoxLichSu from "@/components/games/xucxac/BoxLichSu";
import { LOAI_GAME } from "@/configs/game.config";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
const Home = () => {
  const TYPE_GAME = LOAI_GAME.XUCXAC1P;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Game Xúc Xắc 1 phút" />

      <Layout>
        <RecordBet TYPE_GAME={TYPE_GAME} />
        <BoxLichSu TYPE_GAME={TYPE_GAME} />
      </Layout>
    </>
  );
};

export default Home;
