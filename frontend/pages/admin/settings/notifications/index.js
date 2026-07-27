import Layout from "@/components/admin/Layout";
import ListNotification from "@/components/admin/settings/Notification/ListNotification";
import { NextSeo } from "next-seo";
const Home = () => {
  return (
    <>
      <NextSeo title="Quản lý thông báo" />

      <Layout>
        <ListNotification />
      </Layout>
    </>
  );
};
export default Home;
