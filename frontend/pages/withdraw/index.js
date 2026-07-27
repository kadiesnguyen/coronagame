import Layout from "@/components/Layout";
import FormWithdraw from "@/components/withdraw/FormWithDraw";
import HuongDan from "@/components/withdraw/HuongDan";
import ThongTinSoDu from "@/components/withdraw/ThongTinSoDu";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";

const WithdrawPage = () => {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <NextSeo title="Rút tiền" />
      <Layout>
        <h1 className="title-h1">Rút tiền</h1>
        {status === "authenticated" && (
          <Box sx={{ paddingTop: "5rem" }}>
            <ThongTinSoDu />
            <FormWithdraw />
            <HuongDan />
          </Box>
        )}
      </Layout>
    </>
  );
};
export default WithdrawPage;
