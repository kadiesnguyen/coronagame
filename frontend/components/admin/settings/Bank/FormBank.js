import { Backdrop, Box, Button, CircularProgress, FormControl, Select, Typography } from "@mui/material";

import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { TINH_TRANG_LIST_BANK } from "@/configs/bank.config";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import { convertTinhTrangListBank } from "@/utils/convertTinhTrang";
import { listBank } from "@/utils/listBank";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

const FormBank = ({ data, handleOnSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  // form validation rules
  const validationSchema = Yup.object().shape({
    tenChuTaiKhoan: Yup.string()
      .required("Vui lòng nhập tên chủ tài khoản")
      .trim("Tên chủ tài khoản không hợp lệ")
      .strict(true),
    soTaiKhoan: Yup.string().required("Vui lòng nhập số tài khoản").trim("Số tài khoản không hợp lệ").strict(true),
    status: Yup.boolean(),
    code: Yup.string()
      .required("Vui lòng nhập bank code")
      .trim("Bank code không hợp lệ")
      .test(
        "is-valid",
        (value) => `${value} không hợp lệ`,
        (value) => {
          const findBankByCode = listBank.find((item) => item.code === value);
          return !!findBankByCode;
        }
      )
      .strict(true),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);

  const onSubmit = async ({ tenChuTaiKhoan, soTaiKhoan, code, status }) => {
    try {
      setIsLoading(true);
      const results = await handleOnSubmit({
        tenChuTaiKhoan,
        soTaiKhoan,
        code,
        status,
      });

      toast.success(results?.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "1.5rem",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box
          sx={{
            color: (theme) => theme.palette.text.secondary,

            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1.5rem",
          }}
        >
          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>Tên chủ tài khoản</Typography>
            <Controller
              name="tenChuTaiKhoan"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Tên chủ tài khoản"
                  size="small"
                  fullWidth
                  error={errors.tenChuTaiKhoan ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue={data?.tenChuTaiKhoan ?? ""}
            />
            <ErrorMessageLabel>{errors.tenChuTaiKhoan ? errors.tenChuTaiKhoan.message : ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>Số tài khoản</Typography>
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
              defaultValue={data?.soTaiKhoan ?? ""}
            />
            <ErrorMessageLabel>{errors.soTaiKhoan ? errors.soTaiKhoan.message : ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl fullWidth>
            <Typography>Tình trạng</Typography>
            <Controller
              name="status"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Select
                  labelId="select-status"
                  id="select-status-option"
                  label="Status"
                  input={<OptionMenu />}
                  error={errors.status ? true : false}
                  inputRef={ref}
                  {...field}
                >
                  {Object.values(TINH_TRANG_LIST_BANK).map((item, i) => (
                    <OptionMenuItem key={i} value={item}>
                      {convertTinhTrangListBank(item)}
                    </OptionMenuItem>
                  ))}
                </Select>
              )}
              defaultValue={data?.status ?? true}
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography>Ngân hàng</Typography>
            <Controller
              name="code"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Select
                  labelId="select-code"
                  id="select-code-option"
                  label="code"
                  input={<OptionMenu />}
                  error={errors.code ? true : false}
                  inputRef={ref}
                  {...field}
                >
                  {listBank.map((item, i) => (
                    <OptionMenuItem key={i} value={item.code}>
                      {item.shortName} - {item.name}
                    </OptionMenuItem>
                  ))}
                </Select>
              )}
              defaultValue={data?.code ?? true}
            />
            <ErrorMessageLabel>{errors.code ? errors.code.message : ""}</ErrorMessageLabel>
          </FormControl>

          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};
export default FormBank;
