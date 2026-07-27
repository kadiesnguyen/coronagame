import Layout from "@/components/admin/Layout";
import Overview from "@/components/admin/settings/Overview";
import { NextSeo } from "next-seo";

const Admin = () => {
  return (
    <>
      <NextSeo title="Quản lý hệ thống" />
      <Layout>
        <Overview />
      </Layout>
    </>
  );
};
export default Admin;
