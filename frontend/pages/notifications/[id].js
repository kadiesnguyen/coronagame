import Layout from "@/components/Layout";
import DetailedNotification from "@/components/notification/DetailedNotification";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
const Home = ({ id }) => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Chi tiết thông báo" />

      <Layout>
        <h1 className="title-h1">Chi Tiết Thông báo</h1>

        <Box
          sx={{
            paddingTop: "5rem",
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <DetailedNotification id={id} />
        </Box>
      </Layout>
    </>
  );
};

export default Home;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const id = params.id;

  return {
    props: {
      id,
    },
  };
};
