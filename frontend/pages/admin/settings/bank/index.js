import Layout from "@/components/admin/Layout";
import List from "@/components/admin/settings/Bank/List";
import { NextSeo } from "next-seo";
const Home = () => {
  return (
    <>
      <NextSeo title="Quản lý ngân hàng" />
      <Layout>
        <List />
      </Layout>
    </>
  );
};
export default Home;
