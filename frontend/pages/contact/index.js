import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetTawkToConfig from "@/hooks/useGetTawkToConfig";
import { detectCskhProvider, getCskhIframeUrl, resolveCskhConfig } from "@/utils/cskh";
import { scrubProvideSupportTextLinks } from "@/utils/provideSupport";
import { hideSaleSmartlyUi, openSaleSmartlyChat } from "@/utils/saleSmartly";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useMemo } from "react";

const Contact = () => {
  const { status } = useSession();
  const { data, isLoading } = useGetTawkToConfig({ throwOnError: false });
  const cfg = useMemo(() => resolveCskhConfig(data?.link), [data?.link]);
  const provider = detectCskhProvider(cfg);
  const chatUrl = useMemo(() => getCskhIframeUrl(cfg), [cfg]);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  // Vào /contact → mở chat; rời trang → ẩn (giữ script trong body)
  useEffect(() => {
    if (provider !== "salesmartly" || status !== "authenticated") return undefined;

    let cancelled = false;
    const open = () => {
      openSaleSmartlyChat().then(() => {
        if (cancelled) hideSaleSmartlyUi();
      });
    };
    open();
    window.addEventListener("cskh:open", open);

    return () => {
      cancelled = true;
      window.removeEventListener("cskh:open", open);
      hideSaleSmartlyUi();
    };
  }, [provider, status]);

  useEffect(() => {
    scrubProvideSupportTextLinks();
    const t = setInterval(scrubProvideSupportTextLinks, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <NextSeo title="Chăm sóc khách hàng" />
      {(isLoading || status === "loading") && <LoadingBox isLoading />}

      <Layout>
        <h1 className="title-h1">Chăm sóc khách hàng</h1>
        {provider !== "salesmartly" && (
          <Box
            sx={{
              paddingTop: "1.2rem",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "stretch",
            }}
          >
            <Typography sx={{ color: "#b8c0d4", fontSize: "1.4rem" }}>Chat CSKH ngay bên dưới.</Typography>
            <Box
              data-corona-ps-chat="1"
              sx={{
                width: "100%",
                minHeight: "70vh",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(212,175,55,.35)",
                background: "#0b1528",
              }}
            >
              <Box
                component="iframe"
                title="CSKH"
                src={chatUrl}
                sx={{
                  display: "block",
                  width: "100%",
                  height: "70vh",
                  border: 0,
                  background: "#fff",
                }}
                allow="microphone; camera; clipboard-write"
              />
            </Box>
          </Box>
        )}
      </Layout>
    </>
  );
};

export default Contact;
