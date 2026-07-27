import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import useGetAutoGameStatus from "@/hooks/admin/useGetAutoGameStatus";
import GameKenoService from "@/services/admin/GameService";
import { Backdrop, Box, Button, CircularProgress, FormControl, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const listStatus = [
  {
    tenStatus: "Đang mở",
    value: true,
  },
  {
    tenStatus: "Đang đóng",
    value: false,
  },
];
const DieuChinhAuto = ({ TYPE_GAME = "keno1p" }) => {
  const { data: dataQuery, isLoading, refetch } = useGetAutoGameStatus({ typeGame: TYPE_GAME });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isAutoGame, setIsAutoGame] = useState(dataQuery ?? false);
  useEffect(() => {
    setIsAutoGame(dataQuery ?? false);
  }, [dataQuery]);
  const handleClickDieuChinh = async () => {
    try {
      setIsLoadingState(true);
      const res = await GameKenoService.setStatusAutoGame({ isAutoGame, typeGame: TYPE_GAME });
      refetch();
      toast.success(res?.data?.message ?? "Chỉnh sửa thành công");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra khi thực hiện");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <h2
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Điều chỉnh Auto kết quả
      </h2>

      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",

          width: "100%",
          maxWidth: "600px",
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
            <FormControl fullWidth>
              <Typography>Bật tắt auto kết quả (bên đặt nhiều sẽ thua)</Typography>
              <Select
                labelId="select-status"
                id="select-status-option"
                label="Status"
                input={<OptionMenu />}
                value={isAutoGame}
                onChange={(e) => setIsAutoGame(e.target.value)}
              >
                {listStatus.map((item, i) => (
                  <OptionMenuItem key={item.value} value={item.value}>
                    {item.tenStatus}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              sx={{
                marginTop: "10px",
              }}
              onClick={handleClickDieuChinh}
            >
              Điều chỉnh
            </Button>
          </>
        )}
      </Box>
    </>
  );
};
export default DieuChinhAuto;
