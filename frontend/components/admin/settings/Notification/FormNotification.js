import MediaPickerDialog from "@/components/admin/MediaPickerDialog";
import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import NotificationService from "@/services/admin/NotificationService";
import { resolveMediaUrl } from "@/utils/branding";
import { toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { Backdrop, Box, Button, CircularProgress, FormControl, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const FormNotification = ({ data, handleOnSubmit }) => {
  const editorRef = useRef();
  const initialHinhAnh = data?.hinhAnh ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const validationSchema = Yup.object().shape({
    tieuDe: Yup.string().required("Vui lòng nhập tiêu đề").trim("Tiêu đề không hợp lệ").strict(true),
    hinhAnh: Yup.string().required("Vui lòng chọn hình đại diện").trim("Hình đại diện không hợp lệ").strict(true),
    noiDung: Yup.string().required("Vui lòng nhập nội dung").trim("Nội dung không hợp lệ").strict(true),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm(formOptions);

  const hinhAnh = watch("hinhAnh", initialHinhAnh);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@/ckeditor5-34.1.0-8ogafsbogmr7"),
    };
    setEditorLoaded(true);
  }, []);

  const handlePickImage = (url) => {
    setValue("hinhAnh", url, { shouldValidate: true, shouldDirty: true });
    toast.success("Đã chọn ảnh");
  };

  const handleRemoveImage = async () => {
    if (!hinhAnh) return;
    try {
      setIsUploading(true);
      // Only hard-delete orphan notification uploads; media library files stay
      if (hinhAnh.startsWith("/uploads/notifications/") && hinhAnh !== initialHinhAnh) {
        await NotificationService.deleteHinhAnhFile(hinhAnh);
      }
      setValue("hinhAnh", "", { shouldValidate: true, shouldDirty: true });
      toast.success("Đã bỏ ảnh");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Xóa ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async ({ tieuDe, hinhAnh: imageUrl, noiDung }) => {
    try {
      setIsLoading(true);
      const results = await handleOnSubmit({
        tieuDe,
        hinhAnh: imageUrl,
        noiDung,
      });
      toast.success(results?.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const previewUrl = resolveMediaUrl(hinhAnh);

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={isLoading || isUploading}>
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
          <FormControl variant="standard" sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>Tiêu đề</Typography>
            <Controller
              name="tieuDe"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Tiêu đề"
                  size="small"
                  fullWidth
                  error={!!errors.tieuDe}
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue={data?.tieuDe ?? ""}
            />
            <ErrorMessageLabel>{errors.tieuDe ? errors.tieuDe.message : ""}</ErrorMessageLabel>
          </FormControl>

          <FormControl variant="standard" sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Typography>Hình đại diện</Typography>
            <Controller
              name="hinhAnh"
              control={control}
              defaultValue={initialHinhAnh}
              render={() => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {previewUrl ? (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid rgba(212,175,55,.35)",
                        backgroundColor: "#101d33",
                      }}
                    >
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Hình đại diện"
                        sx={{
                          display: "block",
                          width: "100%",
                          height: { xs: 180, sm: 220 },
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 40,
                          height: 40,
                          backgroundColor: "rgba(11,21,40,.85)",
                          color: "#ef6d6d",
                          border: "1px solid rgba(239,109,109,.5)",
                          "&:hover": { backgroundColor: "rgba(239,109,109,.25)" },
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      onClick={() => setPickerOpen(true)}
                      sx={{
                        width: "100%",
                        maxWidth: 420,
                        minHeight: 160,
                        borderRadius: "12px",
                        border: "1px dashed rgba(212,175,55,.45)",
                        backgroundColor: "#101d33",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        cursor: "pointer",
                        color: "#b8c0d4",
                        "&:hover": { borderColor: "#e5c05b", color: "#e5c05b" },
                      }}
                    >
                      <PhotoCameraOutlinedIcon sx={{ fontSize: 32 }} />
                      <Typography sx={{ fontSize: "1.3rem" }}>Bấm để chọn ảnh từ thư viện</Typography>
                    </Box>
                  )}
                  {previewUrl ? (
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<PhotoCameraOutlinedIcon />}
                      onClick={() => setPickerOpen(true)}
                      sx={{
                        alignSelf: "flex-start",
                        minHeight: 44,
                        borderColor: "rgba(212,175,55,.5)",
                        color: "#e5c05b",
                      }}
                    >
                      Đổi ảnh
                    </Button>
                  ) : null}
                </Box>
              )}
            />
            <ErrorMessageLabel>{errors.hinhAnh ? errors.hinhAnh.message : ""}</ErrorMessageLabel>
          </FormControl>

          {editorLoaded && (
            <FormControl variant="standard" sx={{ display: "flex", flexDirection: "column" }}>
              <Typography>Nội dung</Typography>
              <Box
                sx={{
                  width: "100%",
                  color: "black",
                  fontSize: "2rem",
                  "& .ck-editor__editable": {
                    minHeight: "320px !important",
                  },
                  "& .ck-editor__editable_inline": {
                    minHeight: "320px !important",
                  },
                }}
              >
                <Controller
                  name="noiDung"
                  control={control}
                  render={({ field }) => (
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value}
                      onChange={(_event, editor) => {
                        field.onChange(editor.getData());
                      }}
                    />
                  )}
                  defaultValue={data?.noiDung ?? ""}
                />
                <ErrorMessageLabel>{errors.noiDung ? errors.noiDung.message : ""}</ErrorMessageLabel>
              </Box>
            </FormControl>
          )}

          <Box sx={{ textAlign: "center" }}>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </form>

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePickImage}
        title="Chọn hình đại diện"
      />
    </>
  );
};

export default FormNotification;
