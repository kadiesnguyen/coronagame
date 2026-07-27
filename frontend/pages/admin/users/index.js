import Layout from "@/components/admin/Layout";
import Users from "@/components/admin/users/Users";
import { NextSeo } from "next-seo";
const Home = () => {
  return (
    <>
      <NextSeo title="Quản lý người dùng" />
      <Layout>
        <Users />
      </Layout>
    </>
  );
};
export default Home;
