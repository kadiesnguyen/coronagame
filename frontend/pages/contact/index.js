import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetTawkToConfig from "@/hooks/useGetTawkToConfig";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const { data, isLoading } = useGetTawkToConfig();
  const link = data?.link ?? "";

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Chăm sóc khách hàng" />
      {isLoading && <LoadingBox isLoading={isLoading} />}

      <Layout>
        <h1 className="title-h1">Chăm sóc khách hàng</h1>
        <Box
          sx={{
            paddingTop: "2rem",
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {!isLoading && !link && (
            <Typography sx={{ color: "#b8c0d4" }}>CSKH chưa được cấu hình. Vui lòng liên hệ admin.</Typography>
          )}
          {link && (
            <>
              <Button
                component="a"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ alignSelf: "flex-start", minHeight: "48px" }}
              >
                Mở CSKH
              </Button>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <iframe src={link} frameBorder="0" width="100%" height="100%" title="CSKH" />
              </Box>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
};

export default Home;
