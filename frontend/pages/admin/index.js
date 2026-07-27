import { Box } from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "../../components/admin/Layout";

const Admin = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Trang quản trị Admin</title>
      </Head>
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
            justifyContent: "center",
            color: "text.primary",
            gap: "10px",
            padding: { xs: "40px 10px", md: "40px 20px" },
          }}
        ></Box>
      </Layout>
    </>
  );
};
export default Admin;
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && session.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/settings",
      },
      props: {},
    };
  }
};
