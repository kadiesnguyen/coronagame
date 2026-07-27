import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import ListWithdraw from "@/components/admin/withdraw/ListWithdraw";
import { NextSeo } from "next-seo";

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Lịch sử rút", href: "/admin/withdraw/history" },
];

const Home = () => {
  return (
    <>
      <NextSeo title="Lịch sử rút tiền" />
      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <h1 className="title" style={{ fontSize: "2.5rem" }}>
          Lịch sử rút
        </h1>
        <ListWithdraw statusGroup="history" />
      </Layout>
    </>
  );
};

export default Home;
