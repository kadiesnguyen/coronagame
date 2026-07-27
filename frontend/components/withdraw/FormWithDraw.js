import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormControl, Select, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

import WithdrawService from "@/services/WithdrawService";
import LoadingBox from "../homePage/LoadingBox";
import ErrorMessageLabel from "../input/ErrorMessageLabel";
import OutlinedInput from "../input/OutlinedInput";
const FormWithdraw = ({ listBank }) => {
  const getBalance = useSelector((state) => state.balance.balance);
  const [isLoading, setIsLoading] = useState(false);
  // form validation rules
  const validationSchema = Yup.object().shape({
    soTien: Yup.number()
      .typeError("Vui lòng nhập số tiền hợp lệ")
      .required("Vui lòng nhập số tiền hợp lệ")
      .min(10000, "Vui lòng nhập số tiền từ 10.000đ"),
    nganHang: Yup.string().required("Vui lòng chọn ngân hàng"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);
  const onSubmit = async ({ soTien, nganHang }) => {
    try {
      setIsLoading(true);
      const result = await WithdrawService.createWithdraw({
        soTien,
        nganHang,
      });
      toast.success(result?.data?.message ?? "Tạo yêu cầu rút tiền thành công");
      reset();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra khi tạo yêu cầu rút tiền");
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
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            error={errors.tenNganHang}
          >
            <Typography
              sx={{
                marginBottom: "10px",
              }}
            >
              Ngân hàng
            </Typography>
            <Controller
              name="nganHang"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Select
                  inputRef={ref}
                  labelId="select-bank"
                  id="select-bank-option"
                  label="Ngân hàng"
                  input={<OptionMenu />}
                  {...field}
                >
                  <OptionMenuItem value="">
                    <em>Chọn ngân hàng của bạn</em>
                  </OptionMenuItem>
                  {listBank.map((item, i) => (
                    <OptionMenuItem key={item._id} value={item._id}>
                      {item.tenNganHang} - {item.tenChuTaiKhoan} - {item.soTaiKhoan}
                    </OptionMenuItem>
                  ))}
                </Select>
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.nganHang ? errors.nganHang.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="soTien"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  inputRef={ref}
                  placeholder="Số tiền muốn rút"
                  size="small"
                  type="number"
                  fullWidth
                  error={errors.soTien ? true : false}
                  onWheel={(e) => e.target.blur()}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.soTien ? errors.soTien.message : ""}</ErrorMessageLabel>
          </FormControl>

          <Button
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
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
