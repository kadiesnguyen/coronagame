import DepositService from "@/services/DepositService";
import { yupResolver } from "@hookform/resolvers/yup";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Button, FormControl, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import LoadingBox from "../homePage/LoadingBox";
import ErrorMessageLabel from "../input/ErrorMessageLabel";
import OutlinedInput from "../input/OutlinedInput";

const NOI_DUNG_NAP_TIEN = process.env.MEMO_PREFIX_DEPOSIT || "NAPTIEN";
const FormNap = ({ selectedBank }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [srcVietQR, setSrcVietQR] = useState("");
  useEffect(() => {
    setSrcVietQR("");
  }, [selectedBank]);
  // form validation rules
  const validationSchema = Yup.object().shape({
    soTien: Yup.number()
      .typeError("Vui lòng nhập số tiền hợp lệ")
      .required("Vui lòng nhập số tiền hợp lệ")
      .min(10000, "Vui lòng nhập số tiền từ 10000 trở lên"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    watch,
  } = useForm(formOptions);

  const onSubmit = async ({ soTien }) => {
    try {
      if (!selectedBank) {
        return;
      }
      setIsLoading(true);
      const res = await DepositService.createDeposit({
        soTien: parseInt(soTien),
        nganHang: selectedBank,
      });

      setSrcVietQR(
        `https://img.vietqr.io/image/${selectedBank.code}-${selectedBank.soTaiKhoan}-compact2.png?amount=${soTien}&addInfo=NAPTIEN%20${session.user.taiKhoan}&accountName=${selectedBank.tenChuTaiKhoan}`
      );
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <>
      {selectedBank && (
        <>
          {srcVietQR && (
            <Box
              sx={{
                border: (theme) => `1px solid ${theme.palette.color.primary}`,
                padding: "1rem",
                marginTop: "3rem",
                color: (theme) => theme.palette.text.secondary,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={srcVietQR}
                style={{
                  width: "100%",
                  maxWidth: "25rem",
                }}
              />
              <Box>
                <Typography sx={{}}>
                  Ngân hàng: <b>{selectedBank.tenBank}</b>
                </Typography>
                <Typography sx={{}}>
                  Chủ tài khoản: <b>{selectedBank.tenChuTaiKhoan}</b>
                </Typography>

                <Typography sx={{}}>
                  Số tài khoản: <b>{selectedBank.soTaiKhoan}</b>
                  <ContentCopyIcon
                    onClick={() =>
                      navigator.clipboard.writeText(selectedBank.soTaiKhoan).then(() => {
                        toast.success("Copy thành công");
                      })
                    }
                  />
                </Typography>
                <Typography sx={{}}>
                  Nội dung: <b>{NOI_DUNG_NAP_TIEN + " " + session.user.taiKhoan}</b>
                  <ContentCopyIcon
                    onClick={() =>
                      navigator.clipboard.writeText(NOI_DUNG_NAP_TIEN + " " + session.user.taiKhoan).then(() => {
                        toast.success("Copy thành công");
                      })
                    }
                  />
                </Typography>
              </Box>
            </Box>
          )}
          <LoadingBox isLoading={isLoading} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0,1fr))",
              gap: "1rem",
              marginTop: "1rem",

              color: (theme) => theme.palette.text.secondary,
            }}
          >
            <form
              style={{
                paddingTop: "1rem",
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
              >
                <Typography>Số tiền</Typography>
                <Controller
                  name="soTien"
                  control={control}
                  render={({ field: { ref, onChange, ...field } }) => (
                    <OutlinedInput
                      placeholder="Số tiền"
                      size="small"
                      type="number"
                      fullWidth
                      onWheel={(e) => e.target.blur()}
                      error={errors.soTien ? true : false}
                      inputRef={ref}
                      onChange={(e) => {
                        const removeZeroPrefix = e.target.value.replace(/^0+/, "");
                        // check input valid number using regex
                        if (removeZeroPrefix) {
                          const regex = RegExp(/[0-9]+/g);
                          const testResult = regex.test(removeZeroPrefix);
                          if (testResult) {
                            onChange(removeZeroPrefix);
                          }
                        } else {
                          onChange(removeZeroPrefix);
                        }
                      }}
                      {...field}
                    />
                  )}
                  defaultValue={0}
                />
                <ErrorMessageLabel>{errors.soTien ? errors.soTien.message : ""}</ErrorMessageLabel>
              </FormControl>

              <Button
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {srcVietQR ? "Tạo lệnh nạp tiền khác" : "Tạo lệnh nạp tiền"}
              </Button>
            </form>
          </Box>
        </>
      )}
    </>
  );
};
export default FormNap;
