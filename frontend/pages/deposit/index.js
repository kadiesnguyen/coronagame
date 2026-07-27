import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import { openCskh } from "@/utils/openCskh";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useRef } from "react";

const Deposit = () => {
  const { status } = useSession();
  const openedRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  // Nạp tiền = mở trang chat CSKH trong app
  useEffect(() => {
    if (status !== "authenticated" || openedRef.current) return;
    openedRef.current = true;
    openCskh();
  }, [status]);

  return (
    <>
      <NextSeo title="Nạp tiền" />
      {status === "loading" && <LoadingBox isLoading />}
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
            Nạp tiền được hỗ trợ qua CSKH. Hệ thống sẽ mở cửa sổ chat trên trang.
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
