import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import FormBank from "@/components/admin/settings/Bank/FormBank";
import BankService from "@/services/admin/BankService";
import { NextSeo } from "next-seo";

const ThemBank = () => {
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
      title: "Thêm ngân hàng",
      href: "/admin/settings/bank/new",
    },
  ];

  const handleOnSubmit = async ({ tenChuTaiKhoan, soTaiKhoan, code, status }) => {
    const results = await BankService.createBank({
      data: {
        tenChuTaiKhoan,
        soTaiKhoan,
        code,
        status,
      },
    });
    return results;
  };

  return (
    <>
      <NextSeo title="Thêm ngân hàng" />
      <Layout>
        <BreadcrumbBar data={BreadcrumbData} />
        <h1
          className="title"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Thêm ngân hàng
        </h1>
        <FormBank
          data={{
            tenChuTaiKhoan: "",
            soTaiKhoan: "",
            code: "",
            status: true,
          }}
          handleOnSubmit={handleOnSubmit}
        />
      </Layout>
    </>
  );
};
export default ThemBank;
