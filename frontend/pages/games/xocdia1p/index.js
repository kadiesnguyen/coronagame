import Layout from "@/components/Layout";
import RecordBet from "@/components/games/xocdia/1p/RecordBet";
import BoxLichSu from "@/components/games/xocdia/BoxLichSu";
import { LOAI_GAME } from "@/configs/game.config";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
const Home = () => {
  const TYPE_GAME = LOAI_GAME.XOCDIA1P;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Game Xóc đĩa 1 phút" />
      <Layout>
        <Box
          className="xocdia_background"
          sx={{
            borderRadius: "2rem",

            marginTop: "1rem",

            position: "relative",
            display: "flex",
            flexDirection: "column",
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <RecordBet TYPE_GAME={TYPE_GAME} />
          <BoxLichSu TYPE_GAME={TYPE_GAME} />
        </Box>
      </Layout>
    </>
  );
};

export default Home;
