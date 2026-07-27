import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import ListDepositHistory from "@/components/admin/settings/Deposit/ListDepositHistory";
import { Box } from "@mui/material";
import { NextSeo } from "next-seo";

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Lịch sử nạp", href: "/admin/settings/deposit" },
];

const Home = () => {
  return (
    <>
      <NextSeo title="Lịch sử nạp tiền" />
      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%", overflowX: "hidden" }}>
          <ListDepositHistory statusGroup="history" />
        </Box>
      </Layout>
    </>
  );
};

export default Home;
