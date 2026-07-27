import Layout from "@/components/admin/Layout";
import ListAdmins from "@/components/admin/settings/ListAdmins";
import { NextSeo } from "next-seo";

const AdminListPage = () => {
  return (
    <>
      <NextSeo title="Danh sách quản trị" />
      <Layout>
        <ListAdmins />
      </Layout>
    </>
  );
};

export default AdminListPage;
