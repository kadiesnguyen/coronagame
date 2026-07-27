import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import ListWithdraw from "@/components/admin/withdraw/ListWithdraw";
import { NextSeo } from "next-seo";
const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý rút tiền",
    href: "/admin/withdraw",
  },
];
const Home = () => {
  return (
    <>
      <NextSeo title="Quản lý yêu cầu rút tiền" />
      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <h1
          className="title"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Yêu cầu rút tiền
        </h1>
        <ListWithdraw />
      </Layout>
    </>
  );
};
export default Home;
