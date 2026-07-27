import Layout from "@/components/Layout";
import LoadingBox from "@/components/homePage/LoadingBox";
import AccountInfo from "@/components/user/AccountInfo";
import AccountMenu from "@/components/user/AccountMenu";
import useGetInformationUser from "@/hooks/useGetInformationUser";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
const Profile = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const { data, isLoading } = useGetInformationUser();

  return (
    <>
      <NextSeo title="Thông tin tài khoản" />

      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Layout>
        {data && (
          <>
            <AccountInfo user={data} />
            <AccountMenu />
          </>
        )}
      </Layout>
    </>
  );
};

export default Profile;
