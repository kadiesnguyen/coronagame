import { Backdrop, Box, CircularProgress, FormControl, Typography } from "@mui/material";

import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import OutlinedInput from "@/components/input/OutlinedInput";
import { TINH_TRANG_DEPOSIT_HISTORY } from "@/configs/deposit.config";
import useGetDetailedDepositHistory from "@/hooks/admin/useGetDetailedDepositHistory";
import { convertDateTime } from "@/utils/convertTime";
import { convertTinhTrangDepositHistory } from "@/utils/convertTinhTrang";
import { NextSeo } from "next-seo";

const ChiTiet = ({ ID }) => {
  const { data: dataQuery, isLoading } = useGetDetailedDepositHistory({ id: ID });
  const isPending = dataQuery?.tinhTrang === TINH_TRANG_DEPOSIT_HISTORY.DANG_CHO;

  const BreadcrumbData = [
    { title: "Admin", href: "/admin" },
    {
      title: isPending ? "Yêu cầu nạp" : "Lịch sử nạp",
      href: isPending ? "/admin/deposit" : "/admin/settings/deposit",
    },
    { title: "Chi tiết", href: "/admin/settings/deposit/" + ID },
  ];

  const taiKhoan = dataQuery?.nguoiDung?.taiKhoan ?? "";
  const nganHang =
    `${dataQuery?.nganHang?.shortName || dataQuery?.nganHang?.tenNganHang || ""} - ${
      dataQuery?.nganHang?.soTaiKhoan || ""
    } - ${dataQuery?.nganHang?.tenChuTaiKhoan || ""}`.replace(/^\s-\s|\s-\s$/g, "") || "";
  const noiDung = dataQuery?.noiDung ?? "";
  const thoiGian = dataQuery?.createdAt ?? "";
  const soTien = dataQuery?.soTien ?? 0;
  const tinhTrang = dataQuery?.tinhTrang ?? "";

  return (
    <>
      <NextSeo title={isPending ? "Chi tiết yêu cầu nạp tiền" : "Chi tiết lịch sử nạp tiền"} />

      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BreadcrumbBar data={BreadcrumbData} />

        <h2 className="title admin" style={{ fontSize: "2.5rem" }}>
          {isPending ? "Chi tiết yêu cầu nạp tiền" : "Chi tiết lịch sử nạp tiền"}
        </h2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            maxWidth: "600px",
            gap: "10px",
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          {!isLoading && dataQuery && (
            <>
              <FormControl fullWidth>
                <Typography>Tài khoản</Typography>
                <OutlinedInput size="small" type="text" fullWidth value={taiKhoan} disabled />
              </FormControl>
              <FormControl fullWidth>
                <Typography>Ngân hàng</Typography>
                <OutlinedInput size="small" type="text" fullWidth value={nganHang} disabled />
              </FormControl>
              <FormControl fullWidth>
                <Typography>Số tiền</Typography>
                <OutlinedInput size="small" type="text" fullWidth value={soTien} disabled />
              </FormControl>
              <FormControl fullWidth>
                <Typography>Nội dung phản hồi</Typography>
                <OutlinedInput size="small" type="text" fullWidth value={noiDung} disabled />
              </FormControl>
              <FormControl fullWidth>
                <Typography>Tình trạng</Typography>
                <OutlinedInput
                  size="small"
                  type="text"
                  fullWidth
                  value={convertTinhTrangDepositHistory(tinhTrang)}
                  disabled
                />
              </FormControl>
              <FormControl fullWidth>
                <Typography>Thời gian</Typography>
                <OutlinedInput size="small" type="text" fullWidth value={convertDateTime(thoiGian)} disabled />
              </FormControl>
              {!isPending && (
                <Typography sx={{ fontSize: "1.3rem", color: "#8b95a8", textAlign: "center" }}>
                  Đơn đã xử lý — chỉ xem, không đổi trạng thái. Duyệt/từ chối tại Yêu cầu nạp.
                </Typography>
              )}
              {isPending && (
                <Typography sx={{ fontSize: "1.3rem", color: "#e5c05b", textAlign: "center" }}>
                  Đơn đang chờ — quay lại Yêu cầu nạp để duyệt / từ chối.
                </Typography>
              )}
            </>
          )}
        </Box>
      </Layout>
    </>
  );
};
export default ChiTiet;
export const getServerSideProps = async (context) => {
  const { params } = context;
  return {
    props: {
      ID: params.id,
    },
  };
};
