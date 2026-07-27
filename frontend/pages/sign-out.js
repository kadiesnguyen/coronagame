import handleLogout from "@/utils/logout";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import Layout from "../components/Layout";
const Logout = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      handleLogout(session);
    }
  }, [session]);

  return (
    <>
      <NextSeo title="Đăng xuất tài khoản" />
      <Layout></Layout>
    </>
  );
};

export default Logout;
