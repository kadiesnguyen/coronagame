import Layout from "@/components/admin/Layout";
import TawkTo from "@/components/admin/settings/TawkTo";
import { NextSeo } from "next-seo";
const ChiTiet = () => {
  return (
    <>
      <NextSeo title="Chỉnh sửa cài đặt Tawk.to" />

      <Layout>
        <TawkTo />
      </Layout>
    </>
  );
};
export default ChiTiet;
