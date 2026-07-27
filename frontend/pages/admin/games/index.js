import Layout from "@/components/admin/Layout";
import Overview from "@/components/admin/games/Overview";
import { NextSeo } from "next-seo";

const Admin = () => {
  return (
    <>
      <NextSeo title="Quản lý game" />

      <Layout>
        <Overview />
      </Layout>
    </>
  );
};
export default Admin;
