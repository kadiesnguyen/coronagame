import Layout from "@/components/admin/Layout";
import DepositHistory from "@/components/admin/users/DepositHistory";
import DetailedUser from "@/components/admin/users/DetailedUser";
import ListBalanceFluctuations from "@/components/admin/users/ListBalanceFluctuations";
import ListUserBank from "@/components/admin/users/ListUserBank";
import { NextSeo } from "next-seo";
const ChiTiet = ({ ID }) => {
  return (
    <>
      <NextSeo title="Chi tiết người dùng" />
      <Layout>
        <DetailedUser ID={ID} />
        <ListUserBank ID={ID} />
        <DepositHistory ID={ID} />
        <ListBalanceFluctuations ID={ID} />
        {/* <ListActivities ID={ID} /> */}
      </Layout>
    </>
  );
};
export default ChiTiet;
export const getServerSideProps = async (context) => {
  const { params } = context;
  const ID = params.id;

  return {
    props: {
      ID: ID,
    },
  };
};
