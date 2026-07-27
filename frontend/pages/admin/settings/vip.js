import Layout from "@/components/admin/Layout";
import VipSettings from "@/components/admin/settings/VipSettings";
import { NextSeo } from "next-seo";

const AdminVipSettings = () => {
  return (
    <>
      <NextSeo title="Cấu hình VIP" />
      <Layout>
        <VipSettings />
      </Layout>
    </>
  );
};

export default AdminVipSettings;
