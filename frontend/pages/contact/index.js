import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetTawkToConfig from "@/hooks/useGetTawkToConfig";
import { openCskh } from "@/utils/openCskh";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useRef } from "react";

const Home = () => {
  const { status } = useSession();
  const { data, isLoading } = useGetTawkToConfig();
  const link = data?.link ?? "";
  const openedRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  // Vào /contact → mở luôn tab CSKH (không nhúng iframe)
  useEffect(() => {
    if (isLoading || openedRef.current) return;
    if (!link) return;
    openedRef.current = true;
    openCskh();
  }, [isLoading, link]);

  return (
    <>
      <NextSeo title="Chăm sóc khách hàng" />
      {isLoading && <LoadingBox isLoading={isLoading} />}

      <Layout>
        <h1 className="title-h1">Chăm sóc khách hàng</h1>
        <Box
          sx={{
            paddingTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          {!isLoading && !link && (
            <Typography sx={{ color: "#b8c0d4" }}>CSKH chưa được cấu hình. Vui lòng liên hệ admin.</Typography>
          )}
          {link && (
            <>
              <Typography sx={{ color: "#b8c0d4", fontSize: "1.4rem" }}>
                Đang mở CSKH ở tab mới. Nếu không thấy, bấm nút bên dưới.
              </Typography>
              <Button onClick={() => openCskh()} sx={{ minHeight: "48px" }}>
                Mở CSKH
              </Button>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
};

export default Home;
