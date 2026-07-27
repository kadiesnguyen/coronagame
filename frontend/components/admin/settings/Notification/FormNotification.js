import { Backdrop, Box, Button, CircularProgress, FormControl, Typography } from "@mui/material";

import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

const FormNotification = ({ data, handleOnSubmit }) => {
  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  // form validation rules
  const validationSchema = Yup.object().shape({
    tieuDe: Yup.string().required("Vui lòng nhập tiêu đề").trim("Tiêu đề không hợp lệ").strict(true),
    hinhAnh: Yup.string().required("Vui lòng nhập link ảnh").trim("Link ảnh không hợp lệ").strict(true),
    noiDung: Yup.string().required("Vui lòng nhập nội dung").trim("Nội dung không hợp lệ").strict(true),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@/ckeditor5-34.1.0-8ogafsbogmr7"),
    };
    setEditorLoaded(true);
  }, []);

  const onSubmit = async ({ tieuDe, hinhAnh, noiDung }) => {
    try {
      setIsLoading(true);
      const results = await handleOnSubmit({
        tieuDe,
        hinhAnh,
        noiDung,
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
            <Typography>Tiêu đề</Typography>
            <Controller
              name="tieuDe"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Tiêu đề"
                  size="small"
                  fullWidth
                  error={errors.tieuDe ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue={data?.tieuDe ?? ""}
            />
            <ErrorMessageLabel>{errors.tieuDe ? errors.tieuDe.message : ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl
            variant="standard"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>Link ảnh</Typography>
            <Controller
              name="hinhAnh"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Link hình ảnh"
                  size="small"
                  fullWidth
                  error={errors.hinhAnh ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue={data?.hinhAnh ?? ""}
            />
            <ErrorMessageLabel>{errors.hinhAnh ? errors.hinhAnh.message : ""}</ErrorMessageLabel>
          </FormControl>

          {editorLoaded && (
            <FormControl
              variant="standard"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography>Nội dung</Typography>

              <Box sx={{ width: "100%", color: "black", fontSize: "2rem" }}>
                <Controller
                  name="noiDung"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
                      onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log("Editor is ready to use!", editor);
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        field.onChange(data);
                      }}
                    />
                  )}
                  defaultValue={data?.noiDung ?? ""}
                />
                <ErrorMessageLabel>{errors.noiDung ? errors.noiDung.message : ""}</ErrorMessageLabel>
              </Box>
            </FormControl>
          )}
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
export default FormNotification;
