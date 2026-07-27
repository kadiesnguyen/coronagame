import OutlinedInput from "@/components/input/OutlinedInput";
import { LOAI_CUOC_GAME, convertKeyTiLe, convertLoaiCuoc, getTiLeDefault } from "@/configs/game.xoso.config";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import useGetBetPayoutPercentage from "@/hooks/admin/useGetBetPayoutPercentage";
import GameXocDiaService from "@/services/admin/GameService";
import { Backdrop, Box, Button, CircularProgress, FormControl, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LOAI_TI_LE = Object.values(LOAI_CUOC_GAME).map((loaiCuoc) => ({
  title: convertLoaiCuoc(loaiCuoc),
  key: convertKeyTiLe(loaiCuoc),
}));
const DieuChinhTiLe = ({ TYPE_GAME }) => {
  const tiLeDefault = Object.fromEntries(
    Object.values(LOAI_CUOC_GAME).map((loaiCuoc) => [convertKeyTiLe(loaiCuoc), getTiLeDefault(loaiCuoc)])
  );
  const { data: dataQuery, isLoading, refetch } = useGetBetPayoutPercentage({ typeGame: TYPE_GAME });
  const [tiLe, setTiLe] = useState(dataQuery ?? tiLeDefault);

  const [chiTietCuocSelected, setChiTietCuocSelected] = useState(LOAI_TI_LE[0].key);
  const [isLoadingState, setIsLoadingState] = useState(false);
  useEffect(() => {
    setTiLe(dataQuery ?? tiLeDefault);
  }, [dataQuery]);

  const handleChangeTiLe = (e) => {
    setTiLe((prev) => ({ ...prev, [chiTietCuocSelected]: e.target.value }));
  };
  const handleClickDieuChinh = async () => {
    try {
      let convertNumObj = {};
      let isValidBetPayoutPercent = true;

      Object.keys(tiLe).forEach((keyTiLe) => {
        const convertNum = Number(tiLe[keyTiLe]);
        if (convertNum < 0) {
          isValidBetPayoutPercent = false;
        }
        convertNumObj = { ...convertNumObj, [keyTiLe]: convertNum };
      });

      if (!isValidBetPayoutPercent) {
        toast.error("Vui lòng chọn tỉ lệ hợp lệ");
        return;
      }
      setIsLoadingState(true);
      const res = await GameXocDiaService.setTiLeGame({ tiLe: convertNumObj, typeGame: TYPE_GAME });
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
              <Typography>Chọn loại cược</Typography>
              <Select
                labelId="select-status"
                id="select-status-option"
                label="Status"
                input={<OptionMenu />}
                value={chiTietCuocSelected}
                onChange={(e) => setChiTietCuocSelected(e.target.value)}
              >
                {LOAI_TI_LE.map((item, i) => (
                  <OptionMenuItem key={item.key} value={item.key}>
                    {item.title}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography>Tỉ lệ</Typography>
              <OutlinedInput
                placeholder="Tỉ lệ"
                size="small"
                type="number"
                fullWidth
                value={tiLe[chiTietCuocSelected]}
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
