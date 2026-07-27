import Layout from "@/components/Layout";
import ItemLichSu from "@/components/balance-fluctuations/ItemLichSu";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetBalanceFluctuations from "@/hooks/useGetBalanceFluctuations";
import { Box, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { Bars } from "react-loading-icons";
const Home = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetBalanceFluctuations({});

  return (
    <>
      <NextSeo title="Biến động số dư" />

      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        <h1 className="title-h1">Biến động số dư</h1>

        <Box
          sx={{
            paddingTop: "5rem",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0,1fr))",
              gap: "1rem",
              marginTop: "1rem",

              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {data?.map((item) => (
              <ItemLichSu key={item._id} item={item} />
            ))}
          </Box>
          <Box
            sx={{
              paddingTop: "1rem",
              textAlign: "center",
            }}
          >
            {isFetchingNextPage && <Bars fill="red" width={50} height={50} speed={0.75} />}

            {hasNextPage && !isFetchingNextPage && (
              <Button variant="contained" onClick={() => fetchNextPage()}>
                Tải thêm
              </Button>
            )}
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default Home;
