import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import ListDepositHistory from "@/components/admin/settings/Deposit/ListDepositHistory";
import { NextSeo } from "next-seo";
const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý nạp tiền",
    href: "/admin/settings/deposit",
  },
];
const Home = () => {
  return (
    <>
      <NextSeo title="Quản lý lịch sử nạp tiền" />

      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <h1
          className="title"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Lịch sử nạp tiền
        </h1>

        <ListDepositHistory />
      </Layout>
    </>
  );
};
export default Home;
