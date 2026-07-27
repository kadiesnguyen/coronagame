import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import Item from "@/components/notification/Item";
import useGetListNotifications from "@/hooks/useGetListNotifications";
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

  const {
    data,
    isLoading,
    isFetching,
    isError: isErrorQuery,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetListNotifications({});

  return (
    <>
      <NextSeo title="Thông báo" />
      {isLoading && <LoadingBox isLoading={isLoading} />}
      {isFetchingNextPage && <LoadingBox isLoading={isFetchingNextPage} />}

      <Layout>
        <h1 className="title-h1">Thông báo</h1>

        <Box
          sx={{
            paddingTop: "5rem",
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0,1fr))",
              gap: "2rem",
              marginTop: "1rem",
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {data?.map((item) => (
              <Item key={item._id} item={item} />
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
