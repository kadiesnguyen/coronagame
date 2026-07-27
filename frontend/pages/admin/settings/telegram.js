import Layout from "@/components/admin/Layout";
import BotTelegram from "@/components/admin/settings/BotTelegram";
import { NextSeo } from "next-seo";
const ChiTiet = () => {
  return (
    <>
      <NextSeo title="Cấu hình bot telegram" />
      <Layout>
        <BotTelegram />
      </Layout>
    </>
  );
};
export default ChiTiet;
