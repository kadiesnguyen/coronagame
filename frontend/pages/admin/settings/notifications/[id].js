import { Backdrop, Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import FormNotification from "@/components/admin/settings/Notification/FormNotification";
import useGetDetailedNotification from "@/hooks/admin/useGetDetailedNotification";
import NotificationService from "@/services/admin/NotificationService";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { toast } from "react-toastify";

const ChiTiet = ({ ID }) => {
  const BreadcrumbData = [
    {
      title: "Admin",
      href: "/admin",
    },
    {
      title: "Quản lý thông báo",
      href: "/admin/settings/notifications",
    },
    {
      title: "Chi tiết thông báo",
      href: "/admin/settings/notifications/" + ID,
    },
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data, isLoading: isLoadingQuery, refetch } = useGetDetailedNotification({ id: ID });

  const handleClickDeleteThongBao = async () => {
    try {
      setIsLoading(true);
      const results = await NotificationService.deleteNotification({
        id: ID,
      });
      toast.success(results?.data?.message);

      router.back();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOnSubmit = async ({ tieuDe, hinhAnh, noiDung }) => {
    const results = await NotificationService.editNotification({
      id: ID,
      tieuDe,
      hinhAnh,
      noiDung,
    });
    refetch();
    return results;
  };
  return (
    <>
      <NextSeo title="Chi tiết thông báo" />
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
          Chi tiết thông báo
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

        {data && (
          <>
            <Button onClick={handleClickDeleteThongBao}>Xóa thông báo</Button>

            <FormNotification data={data} handleOnSubmit={handleOnSubmit} />
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
