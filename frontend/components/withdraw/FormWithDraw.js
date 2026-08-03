import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/utils/toast";
import * as Yup from "yup";

import WithdrawService from "@/services/WithdrawService";
import LoadingBox from "../homePage/LoadingBox";
import ErrorMessageLabel from "../input/ErrorMessageLabel";
import OutlinedInput from "../input/OutlinedInput";

const FormWithdraw = () => {
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    tenNganHang: Yup.string().trim().required("Vui lòng nhập tên ngân hàng"),
    tenChuTaiKhoan: Yup.string().trim().required("Vui lòng nhập tên chủ tài khoản"),
    soTaiKhoan: Yup.string().trim().required("Vui lòng nhập số tài khoản"),
    soTien: Yup.number()
      .typeError("Vui lòng nhập số tiền hợp lệ")
      .required("Vui lòng nhập số tiền hợp lệ")
      .min(500000, "Vui lòng nhập số tiền từ 500.000đ"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  const onSubmit = async ({ soTien, tenNganHang, tenChuTaiKhoan, soTaiKhoan }) => {
    try {
      setIsLoading(true);
      const result = await WithdrawService.createWithdraw({
        soTien: Number(soTien),
        tenNganHang,
        tenChuTaiKhoan,
        soTaiKhoan,
      });
      toast.success(result?.data?.message ?? "Tạo yêu cầu rút tiền thành công");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra khi tạo yêu cầu rút tiền");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingBox isLoading={isLoading} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(1, minmax(0,1fr))",
          gap: "10px",
          padding: "0px 20px",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "15px",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl variant="standard" fullWidth error={!!errors.tenNganHang}>
            <Typography sx={{ marginBottom: "10px" }}>Tên ngân hàng</Typography>
            <Controller
              name="tenNganHang"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  inputRef={ref}
                  placeholder="VD: Vietcombank, Techcombank..."
                  size="small"
                  fullWidth
                  error={!!errors.tenNganHang}
                  {...field}
                />
              )}
            />
            <ErrorMessageLabel>{errors.tenNganHang?.message || ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl variant="standard" fullWidth error={!!errors.tenChuTaiKhoan}>
            <Typography sx={{ marginBottom: "10px" }}>Tên chủ tài khoản</Typography>
            <Controller
              name="tenChuTaiKhoan"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  inputRef={ref}
                  placeholder="Tên chủ tài khoản nhận tiền"
                  size="small"
                  fullWidth
                  error={!!errors.tenChuTaiKhoan}
                  {...field}
                />
              )}
            />
            <ErrorMessageLabel>{errors.tenChuTaiKhoan?.message || ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl variant="standard" fullWidth error={!!errors.soTaiKhoan}>
            <Typography sx={{ marginBottom: "10px" }}>Số tài khoản</Typography>
            <Controller
              name="soTaiKhoan"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  inputRef={ref}
                  placeholder="Số tài khoản nhận tiền"
                  size="small"
                  fullWidth
                  error={!!errors.soTaiKhoan}
                  {...field}
                />
              )}
            />
            <ErrorMessageLabel>{errors.soTaiKhoan?.message || ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl variant="standard" fullWidth error={!!errors.soTien}>
            <Typography sx={{ marginBottom: "10px" }}>Số tiền rút</Typography>
            <Controller
              name="soTien"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  inputRef={ref}
                  placeholder="Số tiền muốn rút"
                  size="small"
                  type="number"
                  fullWidth
                  error={!!errors.soTien}
                  onWheel={(e) => e.target.blur()}
                  {...field}
                />
              )}
            />
            <ErrorMessageLabel>{errors.soTien?.message || ""}</ErrorMessageLabel>
          </FormControl>

          <Button
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              minHeight: 48,
            }}
            type="submit"
          >
            Rút tiền
          </Button>
        </form>
      </Box>
    </>
  );
};
export default FormWithdraw;
