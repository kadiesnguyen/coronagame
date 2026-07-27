import { Backdrop, Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

import Layout from "@/components/admin/Layout";
import { toast } from "react-toastify";

import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import FormBank from "@/components/admin/settings/Bank/FormBank";
import useGetDetailedBank from "@/hooks/admin/useGetDetailedBank";
import BankService from "@/services/admin/BankService";

import { NextSeo } from "next-seo";
import { useState } from "react";

const ChiTiet = ({ ID }) => {
  const BreadcrumbData = [
    {
      title: "Admin",
      href: "/admin",
    },
    {
      title: "Quản lý ngân hàng",
      href: "/admin/settings/bank",
    },
    {
      title: "Chi tiết",
      href: "/admin/settings/bank/" + ID,
    },
  ];
  const router = useRouter();
  const { data: dataQuery, isLoading: isLoadingQuery, refetch } = useGetDetailedBank({ id: ID });
  const [isLoading, setIsLoading] = useState(false);

  const handleClickSubmit = async ({ tenChuTaiKhoan, soTaiKhoan, code, status }) => {
    const results = await BankService.updateDetailedBank({
      id: ID,
      data: { tenChuTaiKhoan, soTaiKhoan, code, status },
    });
    refetch();
    return results;
  };
  const handleClickDelete = async () => {
    try {
      setIsLoading(true);
      const results = await BankService.deleteBank({
        id: ID,
      });
      toast.success(results?.data?.message);
      setIsLoading(false);
      router.back();
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <>
      <NextSeo title="Chi tiết ngân hàng" />

      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <BreadcrumbBar data={BreadcrumbData} />
        <h1
          className="title"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Chi tiết ngân hàng
        </h1>

        {isLoadingQuery && (
          <Box
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}

        {dataQuery && (
          <>
            <Button onClick={handleClickDelete}>Xóa ngân hàng</Button>

            <FormBank data={dataQuery} handleOnSubmit={handleClickSubmit} />
          </>
        )}
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
