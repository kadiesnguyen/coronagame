import BreadcrumbBar from "@/components/admin/BreadcrumbBar";
import Layout from "@/components/admin/Layout";
import OutlinedInput from "@/components/input/OutlinedInput";
import { TINH_TRANG_WITHDRAW_HISTORY } from "@/configs/withdraw.config";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import useGetDetailedWithdrawHistory from "@/hooks/admin/useGetDetailedWithdrawHistory";
import WithdrawService from "@/services/admin/WithdrawService";
import { convertDateTime } from "@/utils/convertTime";
import { convertTinhTrangWithdrawHistory } from "@/utils/convertTinhTrang";
import { Backdrop, Box, Button, CircularProgress, FormControl, Select, Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const ChiTiet = ({ ID }) => {
  const BreadcrumbData = [
    {
      title: "Admin",
      href: "/admin",
    },
    {
      title: "Quản lý rút tiền",
      href: "/admin/withdraw",
    },
    {
      title: "Chi tiết",
      href: "/admin/withdraw/" + ID,
    },
  ];
  const { data: dataQuery, isLoading, refetch } = useGetDetailedWithdrawHistory({ id: ID });
  const taiKhoan = dataQuery?.nguoiDung?.taiKhoan ?? "";
  const nganHang =
    `${dataQuery?.nganHang?.tenNganHang} - ${dataQuery?.nganHang?.soTaiKhoan} - ${dataQuery?.nganHang?.tenChuTaiKhoan}` ??
    "";
  const [noiDung, setNoiDung] = useState(dataQuery?.noiDung ?? "");
  const thoiGian = dataQuery?.createdAt ?? "";
  const soTien = dataQuery?.soTien ?? 0;
  const [tinhTrang, setTinhTrang] = useState(dataQuery?.tinhTrang ?? TINH_TRANG_WITHDRAW_HISTORY.DANG_CHO);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  useEffect(() => {
    if (dataQuery) {
      setTinhTrang(dataQuery.tinhTrang);
      setNoiDung(dataQuery.noiDung);
    }
  }, [dataQuery]);
  const handleClickSubmit = async () => {
    try {
      setIsLoadingUpdate(true);
      const results = await WithdrawService.editDetailedWithdrawHistory({
        id: ID,
        noiDung,
        tinhTrang,
      });
      toast.success(results?.data?.message ?? "Chỉnh sửa thành công");
      setIsLoadingUpdate(false);
    } catch (err) {
      setIsLoadingUpdate(false);
      console.log(err);
      toast.error(err?.response?.data?.message ?? "có lỗi khi chỉnh sửa");
    }
  };
  const LIST_STATUS_WITHDRAW = Object.values(TINH_TRANG_WITHDRAW_HISTORY).map((value) => ({
    ten: convertTinhTrangWithdrawHistory(value),
    value,
  }));
  return (
    <>
      <NextSeo title="Chi tiết yêu cầu rút tiền" />
      <Layout>
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoadingUpdate || isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BreadcrumbBar data={BreadcrumbData} />
        <h2
          className="title"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Chi tiết yêu cầu rút tiền
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
          {!isLoading && (
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
                <OutlinedInput
                  placeholder="Nội dung"
                  onChange={(e) => setNoiDung(e.target.value)}
                  size="small"
                  type="text"
                  fullWidth
                  value={noiDung}
                />
              </FormControl>
              <FormControl fullWidth>
                <Typography>
                  Tình trạng{" "}
                  <span
                    style={{
                      color: "red",
                      display: "block",
                    }}
                  >
                    (Nếu thay đổi từ "đang chờ" sang "đã hủy" thì sẽ tự động hoàn lại tiền cho người dùng)
                  </span>
                </Typography>
                <Select
                  labelId="select-status"
                  id="select-status-option"
                  label="Status"
                  input={<OptionMenu />}
                  value={tinhTrang}
                  onChange={(e) => setTinhTrang(e.target.value)}
                >
                  {LIST_STATUS_WITHDRAW.map((item, i) => (
                    <OptionMenuItem key={item.value} value={item.value}>
                      {item.ten}
                    </OptionMenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Typography>Thời gian</Typography>
                <OutlinedInput size="small" type="text" fullWidth value={convertDateTime(thoiGian)} disabled />
              </FormControl>
              <Button variant="outlined" onClick={handleClickSubmit}>
                Chỉnh sửa
              </Button>
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
  const ID = params.id;
  return {
    props: {
      ID: ID,
    },
  };
};
