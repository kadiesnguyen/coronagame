import Layout from "@/components/Layout";
import DanhSachBank from "@/components/deposit/ListBank";
import LoadingBox from "@/components/homePage/LoadingBox";
import useGetListBank from "@/hooks/useGetListBank";
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

  const { data, isLoading } = useGetListBank();

  return (
    <>
      <NextSeo title="Nạp tiền" />

      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        <h1 className="title-h1">Nạp tiền</h1>
        {!isLoading && data && (
          <Box
            sx={{
              paddingTop: "5rem",
            }}
          >
            <DanhSachBank danhSachNganHang={data} />
          </Box>
        )}
      </Layout>
    </>
  );
};

export default Deposit;
