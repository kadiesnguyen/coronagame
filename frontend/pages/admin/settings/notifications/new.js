import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import FormNotification from "@/components/admin/settings/Notification/FormNotification";
import NotificationService from "@/services/admin/NotificationService";
import { NextSeo } from "next-seo";

const ThemThongBao = () => {
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
      title: "Thêm thông báo",
      href: "/admin/settings/notifications/new",
    },
  ];

  const handleOnSubmit = async ({ tieuDe, hinhAnh, noiDung }) => {
    const results = await NotificationService.createNotification({
      tieuDe,
      hinhAnh,
      noiDung,
    });
    return results;
  };

  return (
    <>
      <NextSeo title="Thêm thông báo" />
      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <h1
          className="title"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Thêm thông báo
        </h1>
        <FormNotification
          data={{
            tieuDe: "",
            hinhAnh: "",
            noiDung: "",
          }}
          handleOnSubmit={handleOnSubmit}
        />
      </Layout>
    </>
  );
};
export default ThemThongBao;
