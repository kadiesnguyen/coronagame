import OutlinedInput from "@/components/input/OutlinedInput";
import { LOAI_GAME } from "@/configs/game.config";
import useGetBetPayoutPercentage from "@/hooks/admin/useGetBetPayoutPercentage";
import GameKenoService from "@/services/admin/GameService";
import { Backdrop, Box, Button, CircularProgress, FormControl, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/utils/toast";
import AdminSection from "../AdminSection";

const DEFAULT_VIP_TI_LE = { vip1: 2.1, vip2: 2.2, vip3: 2.3 };

const DieuChinhTiLe = ({ TYPE_GAME = "keno1p" }) => {
  const isKeno10P = TYPE_GAME === LOAI_GAME.KENO10P;
  const { data: dataQuery, isLoading, refetch } = useGetBetPayoutPercentage({ typeGame: TYPE_GAME });
  const [tiLe, setTiLe] = useState(dataQuery ?? 0);
  const [tiLeVip, setTiLeVip] = useState(DEFAULT_VIP_TI_LE);
  const [isLoadingState, setIsLoadingState] = useState(false);

  useEffect(() => {
    if (isKeno10P) {
      setTiLeVip({
        vip1: dataQuery?.vip1 ?? DEFAULT_VIP_TI_LE.vip1,
        vip2: dataQuery?.vip2 ?? DEFAULT_VIP_TI_LE.vip2,
        vip3: dataQuery?.vip3 ?? DEFAULT_VIP_TI_LE.vip3,
      });
    } else {
      setTiLe(dataQuery);
    }
  }, [dataQuery, isKeno10P]);

  const handleClickDieuChinh = async () => {
    try {
      if (isKeno10P) {
        const payload = {
          vip1: Number(tiLeVip.vip1),
          vip2: Number(tiLeVip.vip2),
          vip3: Number(tiLeVip.vip3),
        };
        if (Object.values(payload).some((v) => !Number.isFinite(v) || v < 0)) {
          toast.error("Vui lòng chọn tỉ lệ VIP hợp lệ");
          return;
        }
        setIsLoadingState(true);
        await GameKenoService.setTiLeGame({ tiLe: payload, typeGame: TYPE_GAME });
      } else {
        const convertNum = Number(tiLe);
        if (convertNum < 0) {
          toast.error("Vui lòng chọn tỉ lệ hợp lệ");
          return;
        }
        setIsLoadingState(true);
        await GameKenoService.setTiLeGame({ tiLe: convertNum, typeGame: TYPE_GAME });
      }
      refetch();
      toast.success("Chỉnh sửa thành công");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra khi thực hiện");
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <AdminSection
      title={isKeno10P ? "Tỉ lệ trả thưởng VIP" : "Tỉ lệ trả thưởng"}
      subtitle={isKeno10P ? "Điều chỉnh tỉ lệ theo từng cấp VIP" : "Cập nhật tỉ lệ trả thưởng cho game"}
    >
      {isKeno10P && (
        <Typography sx={{ marginBottom: "12px", color: "#b8c0d4" }}>
          Ngưỡng VIP (số dư):{" "}
          <Link href="/admin/settings/vip" style={{ color: "#e5c05b", fontWeight: 700 }}>
            Cấu hình VIP tại đây
          </Link>
        </Typography>
      )}

      <Box
        sx={{
          color: "text.secondary",
          width: "100%",
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
            {isKeno10P ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[1, 2, 3].map((level) => {
                  const key = `vip${level}`;
                  return (
                    <FormControl fullWidth key={key}>
                      <Typography>Tỉ lệ VIP{level}</Typography>
                      <OutlinedInput
                        placeholder={`Tỉ lệ VIP${level}`}
                        size="small"
                        type="number"
                        fullWidth
                        value={tiLeVip[key]}
                        onChange={(e) => setTiLeVip((prev) => ({ ...prev, [key]: e.target.value }))}
                        onWheel={(e) => e.target.blur()}
                      />
                    </FormControl>
                  );
                })}
              </Box>
            ) : (
              <FormControl fullWidth>
                <Typography>Tỉ lệ</Typography>
                <OutlinedInput
                  placeholder="Tỉ lệ"
                  size="small"
                  type="number"
                  fullWidth
                  onChange={(e) => setTiLe(e.target.value)}
                  defaultValue={dataQuery}
                  onWheel={(e) => e.target.blur()}
                />
              </FormControl>
            )}

            <Button
              sx={{
                marginTop: "16px",
                minHeight: "48px",
              }}
              onClick={handleClickDieuChinh}
            >
              Lưu tỉ lệ
            </Button>
          </>
        )}
      </Box>
    </AdminSection>
  );
};
export default DieuChinhTiLe;
