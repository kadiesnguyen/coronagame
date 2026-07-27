import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import FormWithdraw from "@/components/withdraw/FormWithDraw";
import HuongDan from "@/components/withdraw/HuongDan";
import ThongTinSoDu from "@/components/withdraw/ThongTinSoDu";
import useGetListUserBank from "@/hooks/useGetListUserBank";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
const Deposit = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);
  const { data, isLoading } = useGetListUserBank();
  return (
    <>
      <NextSeo title="Rút tiền" />
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        <h1 className="title-h1">Rút tiền</h1>
        {!isLoading && data && (
          <Box
            sx={{
              paddingTop: "5rem",
            }}
          >
            <ThongTinSoDu />
            <FormWithdraw listBank={data.data} />
            <HuongDan />
          </Box>
        )}
      </Layout>
    </>
  );
};
export default Deposit;
