import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import Item from "@/components/participation-history/Item";
import useGetLichSuThamGia from "@/hooks/useGetLichSuThamGia";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { Bars } from "react-loading-icons";

const ParticipationHistory = () => {
  const { status } = useSession();
  const theme = useTheme();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetLichSuThamGia({});

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Lịch sử tham gia" />
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        <h1 className="title-h1">Lịch sử tham gia</h1>
        <Box sx={{ paddingTop: "5rem" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0,1fr))",
              marginTop: "1rem",
              color: (t) => t.palette.text.secondary,
            }}
          >
            {data?.map((item) => (
              <Item key={item.id} item={item} />
            ))}
            {!isLoading && (!data || data.length === 0) && (
              <Typography sx={{ color: "#b8c0d4", textAlign: "center", padding: "2rem 0" }}>
                Chưa có lịch sử cược
              </Typography>
            )}
          </Box>
          <Box sx={{ paddingTop: "1rem", textAlign: "center" }}>
            {isFetchingNextPage && <Bars fill={theme.palette.color.primary} width={50} height={50} speed={0.75} />}
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

export default ParticipationHistory;
