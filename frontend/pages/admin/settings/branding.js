import Layout from "@/components/admin/Layout";
import BrandingSettings from "@/components/admin/settings/BrandingSettings";
import { NextSeo } from "next-seo";

const AdminBranding = () => {
  return (
    <>
      <NextSeo title="Logo & Banner" />
      <Layout>
        <BrandingSettings />
      </Layout>
    </>
  );
};

export default AdminBranding;
