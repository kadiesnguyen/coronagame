import OutlinedInput from "@/components/input/OutlinedInput";
import useGetBetPayoutPercentage from "@/hooks/admin/useGetBetPayoutPercentage";
import GameKenoService from "@/services/admin/GameService";
import { Backdrop, Box, Button, CircularProgress, FormControl, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DieuChinhTiLe = ({ TYPE_GAME }) => {
  const { data: dataQuery, isLoading, refetch } = useGetBetPayoutPercentage({ typeGame: TYPE_GAME });
  const [tiLe, setTiLe] = useState(dataQuery ?? 0);
  const [isLoadingState, setIsLoadingState] = useState(false);
  useEffect(() => {
    setTiLe(dataQuery ?? 0);
  }, [dataQuery]);

  const handleChangeTiLe = (e) => {
    setTiLe(e.target.value);
  };
  const handleClickDieuChinh = async () => {
    try {
      const convertNum = Number(tiLe);
      if (convertNum < 0) {
        toast.error("Vui lòng chọn tỉ lệ hợp lệ");
        return;
      }
      setIsLoadingState(true);
      const res = await GameKenoService.setTiLeGame({ tiLe: convertNum, typeGame: TYPE_GAME });
      refetch();
      toast.success("Chỉnh sửa thành công");
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
        Điều chỉnh tỉ lệ trả thưởng
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
              <Typography>Tỉ lệ</Typography>
              <OutlinedInput
                placeholder="Tỉ lệ"
                size="small"
                type="number"
                fullWidth
                value={tiLe}
                onChange={handleChangeTiLe}
                onWheel={(e) => e.target.blur()}
              />
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
export default DieuChinhTiLe;
