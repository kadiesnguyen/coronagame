import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetTawkToConfig from "@/hooks/useGetTawkToConfig";
import { openCskh } from "@/utils/openCskh";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

const Deposit = () => {
  const { status } = useSession();
  const { data, isLoading } = useGetTawkToConfig();
  const link = data?.link ?? "";

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  // Vào trang nạp → mở luôn link CSKH
  useEffect(() => {
    if (status !== "authenticated" || isLoading) return;
    openCskh();
  }, [status, isLoading, link]);

  return (
    <>
      <NextSeo title="Nạp tiền" />
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        <h1 className="title-h1">Nạp tiền</h1>
        <Box
          sx={{
            paddingTop: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          <Typography sx={{ color: "#b8c0d4", fontSize: "1.5rem" }}>
            Nạp tiền được hỗ trợ qua CSKH. Hệ thống sẽ mở cửa sổ chăm sóc khách hàng.
          </Typography>
          <Button
            onClick={() => openCskh()}
            sx={{
              minHeight: 48,
              backgroundColor: "#d4af37",
              color: "#0b1528",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#e5c05b" },
            }}
          >
            Mở CSKH để nạp tiền
          </Button>
        </Box>
      </Layout>
    </>
  );
};

export default Deposit;
