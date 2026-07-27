import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import ListBankService from "@/services/ListBankService";
import { listBank } from "@/utils/listBank";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormControl, Select, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import LoadingBox from "../homePage/LoadingBox";
import ErrorMessageLabel from "../input/ErrorMessageLabel";
import OutlinedInput from "../input/OutlinedInput";
const AddBank = () => {
  const [isLoading, setIsLoading] = useState(false);
  // form validation rules
  const validationSchema = Yup.object().shape({
    chuTaiKhoan: Yup.string()
      .required("Vui lòng nhập tên chủ tài khoản")
      .trim("Chủ tài khoản không hợp lệ")
      .strict(true),
    soTaiKhoan: Yup.string().required("Vui lòng nhập số tài khoản").trim("Số tài khoản không hợp lệ").strict(true),
    tenNganHang: Yup.string().required("Vui lòng chọn ngân hàng"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);

  const onSubmit = async (data) => {
    try {
      // check ngân hàng hợp lệ
      const nganHangID = data.tenNganHang;
      const checkNganHangID = listBank.find((item) => item.bin === nganHangID);

      if (!checkNganHangID) {
        toast.error("Ngân hàng không hợp lệ");
        return;
      }
      setIsLoading(true);
      const result = await ListBankService.addUserBank({
        tenNganHang: checkNganHangID.shortName,
        bankCode: nganHangID,
        tenChuTaiKhoan: data.chuTaiKhoan,
        soTaiKhoan: data.soTaiKhoan,
      });
      toast.success(result?.data?.message ?? "Thêm ngân hàng thành công");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra khi thêm ngân hàng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(1, minmax(0,1fr))",
          gap: "1rem",
          marginTop: "1rem",
          padding: "0px 2rem",

          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <form
          style={{
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1.5rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            error={errors.tenNganHang ? true : false}
          >
            <Typography
              sx={{
                marginBottom: "1rem",
              }}
            >
              Ngân hàng
            </Typography>
            <Controller
              name="tenNganHang"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Select
                  labelId="select-bank"
                  id="select-bank-option"
                  {...register("tenNganHang")}
                  label="Ngân hàng"
                  input={<OptionMenu />}
                  inputRef={ref}
                  {...field}
                >
                  <OptionMenuItem value="">
                    <em>None</em>
                  </OptionMenuItem>
                  {listBank.map((item, i) => (
                    <OptionMenuItem key={item.bin} value={item.bin}>
                      {item.shortName}
                    </OptionMenuItem>
                  ))}
                </Select>
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.tenNganHang ? errors.tenNganHang.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="chuTaiKhoan"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Chủ tài khoản"
                  size="small"
                  fullWidth
                  error={errors.chuTaiKhoan ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.chuTaiKhoan ? errors.chuTaiKhoan.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="soTaiKhoan"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Số tài khoản"
                  size="small"
                  fullWidth
                  error={errors.soTaiKhoan ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.soTaiKhoan ? errors.soTaiKhoan.message : ""}</ErrorMessageLabel>
          </FormControl>

          <Button
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
            type="submit"
          >
            Thêm
          </Button>
        </form>
      </Box>
    </>
  );
};
export default AddBank;
