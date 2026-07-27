import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetTawkToConfig from "@/hooks/useGetTawkToConfig";
import {
  ensureProvideSupportLoaded,
  getProvideSupportChatUrl,
  openProvideSupportChat,
  resolveChatScript,
} from "@/utils/provideSupport";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";

const Contact = () => {
  const { status } = useSession();
  const { data, isLoading } = useGetTawkToConfig();
  const chatScript = useMemo(() => resolveChatScript(data?.link), [data?.link]);
  const chatUrl = useMemo(() => getProvideSupportChatUrl(data?.link || chatScript), [data?.link, chatScript]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated" || isLoading) return;

    let cancelled = false;

    const boot = async () => {
      await ensureProvideSupportLoaded(chatScript);
      if (cancelled) return;
      setReady(true);
      // Try native ProvideSupport window; iframe below always shows chat in-page
      void openProvideSupportChat();
    };

    void boot();

    const onReopen = () => {
      void openProvideSupportChat();
    };
    window.addEventListener("cskh:open", onReopen);

    return () => {
      cancelled = true;
      window.removeEventListener("cskh:open", onReopen);
    };
  }, [status, isLoading, chatScript]);

  return (
    <>
      <NextSeo title="Chăm sóc khách hàng" />
      {(isLoading || status === "loading") && <LoadingBox isLoading />}

      <Layout>
        <h1 className="title-h1">Chăm sóc khách hàng</h1>
        <Box
          sx={{
            paddingTop: "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "stretch",
          }}
        >
          <Typography sx={{ color: "#b8c0d4", fontSize: "1.4rem" }}>
            Chat CSKH ngay bên dưới. Nếu cửa sổ nổi không hiện, dùng khung chat trên trang.
          </Typography>
          <Button
            onClick={() => openProvideSupportChat()}
            disabled={!ready}
            sx={{
              alignSelf: "flex-start",
              minHeight: "48px",
              backgroundColor: "#d4af37",
              color: "#0b1528",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#e5c05b" },
            }}
          >
            Mở cửa sổ chat
          </Button>
          <Box
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
              title="CSKH ProvideSupport"
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
      </Layout>
    </>
  );
};

export default Contact;
