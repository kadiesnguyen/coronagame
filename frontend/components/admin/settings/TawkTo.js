import OutlinedInput from "@/components/input/OutlinedInput";
import useGetTawkToConfig from "@/hooks/admin/useGetTawkToConfig";
import SystemService from "@/services/admin/SystemService";
import { DEFAULT_CSKH_SCRIPT } from "@/utils/cskh";
import { toast } from "@/utils/toast";
import { Backdrop, Box, Button, CircularProgress, FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BreadcrumbBar from "../BreadcrumbBar";

const BreadcrumbsData = [
  { title: "Admin", href: "/admin" },
  { title: "Settings", href: "/admin/settings" },
  { title: "Cài đặt CSKH", href: "/admin/settings/tawk-to" },
];

const TawkTo = () => {
  const { data: dataQuery, isLoading, refetch } = useGetTawkToConfig();
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (dataQuery?.link != null) {
      setLink(dataQuery.link);
    }
  }, [dataQuery]);

  const handleClickChange = async () => {
    try {
      setIsLoadingState(true);
      const res = await SystemService.updateTawkToConfig({
        tawkToConfigs: { link: link.trim() || DEFAULT_CSKH_SCRIPT },
      });
      refetch();
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Cấu hình CSKH không hợp lệ");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <BreadcrumbBar data={BreadcrumbsData} />
      <h1 className="title" style={{ fontSize: "2.5rem" }}>
        Cài đặt CSKH
      </h1>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          maxWidth: "60rem",
          gap: "1rem",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {isLoadingState && (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingState}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {isLoading && <CircularProgress color="inherit" />}
        {!isLoading && (
          <>
            <Typography sx={{ alignSelf: "stretch" }}>
              Dán mã SaleSmartly (khuyến nghị) hoặc ProvideSupport. SaleSmartly hiện bubble chat trên web; bấm CSKH sẽ mở
              cửa sổ chat.
            </Typography>
            <FormControl fullWidth>
              <Typography>Script CSKH (SaleSmartly)</Typography>
              <OutlinedInput
                placeholder='<script src="https://plugin-code.salesmartly.com/js/project_....js"></script>'
                size="small"
                type="text"
                name="link"
                fullWidth
                multiline
                minRows={4}
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </FormControl>
            <Typography sx={{ alignSelf: "stretch", fontSize: "1.3rem", opacity: 0.85 }}>
              Mặc định: SaleSmartly project_787640_815005_1785157395.js
            </Typography>
            <Button onClick={handleClickChange}>Lưu thay đổi</Button>
          </>
        )}
      </Box>
    </>
  );
};
export default TawkTo;
