import Layout from "@/components/Layout";
import NotFoundPage from "@/public/assets/images/404_page.png";
import { Box, Button } from "@mui/material";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
const ErrorPage = () => {
  return (
    <>
      <NextSeo
        title="404 Error - Không tìm thấy trang"
        description="Không tìm thấy trang, 404 not found, lỗi tìm kiếm, lỗi trang"
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${process.env.NEXTAUTH_URL}/?error`,
        }}
        twitter={{
          handle: "Thinh Le",
          site: `${process.env.NEXTAUTH_URL}/?error`,
          cardType: "summary_large_image",
        }}
      />
      <Layout>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center", padding: "20px" }}>
          <Box sx={{ maxWidth: "40rem", width: "100%", height: "250px", position: "relative" }}>
            <Image
              src={NotFoundPage}
              priority
              objectFit="contain"
              layout="fill"
              alt="404 Error - Không tìm thấy trang"
            />
          </Box>
          <Link href="/">
            <Button>Quay về trang chủ</Button>
          </Link>
        </Box>
      </Layout>
    </>
  );
};
export default ErrorPage;
