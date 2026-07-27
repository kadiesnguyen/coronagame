import Layout from "@/components/admin/Layout";
import TawkTo from "@/components/admin/settings/TawkTo";
import { NextSeo } from "next-seo";
const ChiTiet = () => {
  return (
    <>
      <NextSeo title="Cài đặt CSKH" />

      <Layout>
        <TawkTo />
      </Layout>
    </>
  );
};
export default ChiTiet;
