import BetMoneyStickyPanel from "@/components/games/BetMoneyStickyPanel";
import { GAME_DAT_CUOC_ID } from "@/components/games/StickyBetBar";
import LoadingBox from "@/components/homePage/LoadingBox";
import { TINH_TRANG_GAME, USER_BET_GAME_HISTORY_PAGE_SIZE } from "@/configs/game.keno.config";
import { LOAI_BI_KENO10P, LOAI_CUOC_KENO10P, TEN_VI_TRI } from "@/configs/game.keno10p.config";
import useGetBetPayoutPercentage from "@/hooks/useGetBetPayoutPercentage";
import useGetDetailedBetHistory from "@/hooks/useGetDetailedBetHistory";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import GameService from "@/services/GameService";
import convertMoney from "@/utils/convertMoney";
import { convertInputTienCuoc, isNumberKey } from "@/utils/input";
import { mergeKenoBets } from "@/utils/mergeGameBets";
import { syncPendingBetAmount } from "@/utils/syncPendingBetAmount";
import { toast } from "@/utils/toast";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { memo, useEffect, useRef, useState } from "react";

const ItemCuoc = styled(Box)(() => ({
  borderRadius: 0,
  padding: "10px 8px",
  cursor: "pointer",
  backgroundColor: "transparent",
  position: "relative",
  display: "flex",
  gap: "4px",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "56px",
  color: "#fff",
  borderRight: "1px solid rgba(255,255,255,.12)",
  borderBottom: "1px solid rgba(255,255,255,.12)",
  "&:nth-of-type(2n)": {
    borderRight: "none",
  },
  "&:nth-of-type(n+3)": {
    borderBottom: "none",
  },
  "& .loai_cuoc": {
    fontWeight: 700,
    color: "#e5c05b",
    fontSize: "1.4rem",
    lineHeight: 1.2,
  },
  "& .ti_le": {
    color: "#b8c0d4",
    fontSize: "1.2rem",
  },
  "& .tien_cuoc": {
    fontWeight: 700,
    color: "#e2c499",
    fontSize: "1.1rem",
  },
  "&.active": {
    backgroundColor: "rgba(212,175,55,.18)",
  },
  "&.chip": {
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,.12)",
    backgroundColor: "#101d33",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "56px",
    borderRight: "1px solid rgba(255,255,255,.12)",
    borderBottom: "1px solid rgba(255,255,255,.12)",
  },
  "&.active-tien_cuoc": {
    backgroundColor: "#d4af37",
    borderColor: "#e5c05b",
    "& .loai_cuoc": {
      color: "#0b1528",
    },
  },
}));

const BoxDatCuoc = ({ TYPE_GAME = "keno10p", phien, tinhTrang, vipLevel }) => {
  const boxDatCuocRef = useRef(null);
  const titleDatCuocRef = useRef(null);
  const inputDatCuocRef = useRef(null);
  const { data: detailedBetHistoryData, refetch: refetchDetailedBetHistory } = useGetDetailedBetHistory({
    typeGame: TYPE_GAME,
    phien,
    vipLevel,
  });
  const { data: betPayoutPercentageData } = useGetBetPayoutPercentage({ typeGame: TYPE_GAME, vipLevel });
  const { refetch: refetchUserBetHistory } = useGetUserBetHistory({
    typeGame: TYPE_GAME,
    pageSize: USER_BET_GAME_HISTORY_PAGE_SIZE,
    vipLevel,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAllowResetBtn, setIsAllowResetBtn] = useState(false);
  const [tienCuoc, setTienCuoc] = useState(0);
  const [chiTietCuocTemp, setChiTietCuocTemp] = useState([]);
  const tiLe = typeof betPayoutPercentageData === "number" ? betPayoutPercentageData : 0;
  const chiTietCuocHienTai = detailedBetHistoryData?.datCuoc ?? [];

  useEffect(() => {
    setChiTietCuocTemp([]);
    setTienCuoc(0);
    setIsAllowResetBtn(false);
  }, [phien, vipLevel]);

  useEffect(() => {
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY || tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG) {
      setChiTietCuocTemp([]);
      setTienCuoc(0);
      setIsAllowResetBtn(false);
    }
  }, [tinhTrang]);

  const applyTienCuocToPending = (amount) => {
    setTienCuoc((prevDraft) => {
      setChiTietCuocTemp((prev) => syncPendingBetAmount(prev, prevDraft, amount));
      return amount;
    });
    if (amount && amount > 0) setIsAllowResetBtn(true);
  };

  const handleSubmitCuoc = async () => {
    try {
      if (chiTietCuocTemp.length === 0) {
        toast.error("Vui lòng chọn cược");
        boxDatCuocRef?.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (chiTietCuocTemp.some((e) => !e.tienCuoc || e.tienCuoc <= 0)) {
        toast.error("Vui lòng chọn tiền cược hợp lệ");
        titleDatCuocRef?.current?.scrollIntoView({ behavior: "smooth" });
        inputDatCuocRef?.current?.focus();
        return;
      }
      setIsLoading(true);
      const results = await GameService.createDatCuoc({
        typeGame: TYPE_GAME,
        data: {
          phien,
          chiTietCuoc: mergeKenoBets(chiTietCuocHienTai, chiTietCuocTemp),
          ...(vipLevel ? { vipLevel } : {}),
        },
      });
      await refetchDetailedBetHistory();
      refetchUserBetHistory();
      toast.success(results?.data?.message ?? "Đặt cược thành công");
      handleResetCuoc();
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 401 ? "Vui lòng đăng nhập lại để đặt cược" : null) ||
        "Lỗi hệ thống: không thể cược";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTienCuoc = (e, value) => {
    if (!isNumberKey(e)) {
      e.preventDefault();
      return;
    }
    applyTienCuocToPending(convertInputTienCuoc(value));
  };

  const handleClickCuoc = ({ loaiCuoc, loaiBi, tienCuoc: amount }) => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      toast.error("Vui lòng đợi phiên mới");
      return;
    }
    const betAmount = amount > 0 && _.isNumber(amount) ? amount : 0;
    const findItem = chiTietCuocTemp.find((e) => e.loaiBi === loaiBi && e.loaiCuoc === loaiCuoc);

    if (!findItem) {
      setChiTietCuocTemp((state) => [...state, { loaiCuoc, loaiBi, tienCuoc: betAmount }]);
      setIsAllowResetBtn(true);
      return;
    }
    if (betAmount <= 0) {
      if (findItem.tienCuoc === 0) {
        setChiTietCuocTemp((state) => state.filter((e) => !(e.loaiBi === loaiBi && e.loaiCuoc === loaiCuoc)));
      }
      return;
    }
    const newTienCuoc = findItem.tienCuoc + betAmount;
    setChiTietCuocTemp((prevState) =>
      prevState.map((obj) => (obj.loaiCuoc === loaiCuoc && obj.loaiBi === loaiBi ? { ...obj, tienCuoc: newTienCuoc } : obj))
    );
    setIsAllowResetBtn(true);
  };

  const handleResetCuoc = () => {
    setChiTietCuocTemp([]);
    setTienCuoc(0);
    setIsAllowResetBtn(false);
  };

  return (
    <>
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Box
        id={GAME_DAT_CUOC_ID}
        sx={{
          borderRadius: "2rem",
          padding: { xs: "1rem", md: "2rem" },
          marginTop: "1rem",
          backgroundColor: (theme) => theme.palette.background.default,
          position: "relative",
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <h2 className="title">Đặt cược</h2>

        <Box
          ref={boxDatCuocRef}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "12px",
          }}
        >
          {LOAI_BI_KENO10P.map((loaiBi) => (
            <Box
              key={loaiBi}
              sx={{
                border: "1px solid rgba(212,175,55,.25)",
                borderRadius: "12px",
                padding: "8px",
                backgroundColor: "#162948",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "8px",
                  color: "#fff",
                  fontSize: "1.4rem",
                  lineHeight: 1.3,
                }}
              >
                {TEN_VI_TRI[loaiBi]}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                  backgroundColor: "#101d33",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              >
                {LOAI_CUOC_KENO10P.map((itemLoaiCuoc) => {
                  const active = !!chiTietCuocTemp.find(
                    (e) => e.loaiBi === loaiBi && e.loaiCuoc === itemLoaiCuoc.loaiCuoc
                  );
                  return (
                    <ItemCuoc
                      key={itemLoaiCuoc.loaiCuoc}
                      className={active ? "active" : ""}
                      onClick={() =>
                        handleClickCuoc({ loaiCuoc: itemLoaiCuoc.loaiCuoc, loaiBi, tienCuoc })
                      }
                    >
                      <Typography className="loai_cuoc">{itemLoaiCuoc.tenCuoc}</Typography>
                      <Typography className="ti_le">{Number(tiLe).toFixed(3)}</Typography>
                    </ItemCuoc>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

      </Box>
      <BetMoneyStickyPanel
        tienCuoc={tienCuoc}
        onChangeInput={(e) => handleChangeTienCuoc(e, e.target.value)}
        onSubmit={handleSubmitCuoc}
        onReset={handleResetCuoc}
        inputRef={inputDatCuocRef}
        titleRef={titleDatCuocRef}
        isSpinning={tinhTrang === TINH_TRANG_GAME.DANG_QUAY}
        resetDisabled={!isAllowResetBtn}
      />
    </>
  );
};

export default memo(BoxDatCuoc);
