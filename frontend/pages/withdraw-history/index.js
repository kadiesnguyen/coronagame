import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import Item from "@/components/withdraw-history/Item";
import useGetWithdrawHistory from "@/hooks/useGetWithdrawHistory";
import { Box, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { Bars } from "react-loading-icons";
const WithdrawHistory = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetWithdrawHistory({});
  return (
    <>
      <NextSeo title="Lịch sử rút tiền" />
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        <h1 className="title-h1">Lịch sử rút tiền</h1>
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
export default WithdrawHistory;
