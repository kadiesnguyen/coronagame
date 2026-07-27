import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo, useEffect, useRef, useState } from "react";

import BetMoneyStickyPanel from "@/components/games/BetMoneyStickyPanel";
import { GAME_DAT_CUOC_ID } from "@/components/games/StickyBetBar";
import LoadingBox from "@/components/homePage/LoadingBox";
import { LOAI_CUOC, TINH_TRANG_GAME, USER_BET_GAME_HISTORY_PAGE_SIZE } from "@/configs/game.xucxac.config";
import useGetBetPayoutPercentage from "@/hooks/useGetBetPayoutPercentage";
import useGetDetailedBetHistory from "@/hooks/useGetDetailedBetHistory";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import GameService from "@/services/GameService";
import { mergeCltxBets } from "@/utils/mergeGameBets";
import { syncPendingBetAmount } from "@/utils/syncPendingBetAmount";
import { toast } from "@/utils/toast";
import _ from "lodash";

const ItemCuoc = styled(Box)(() => ({
  borderRadius: 0,
  padding: "12px 8px",
  cursor: "pointer",
  backgroundColor: "transparent",
  position: "relative",
  display: "flex",
  gap: "4px",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "64px",
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
    fontSize: "1.5rem",
    lineHeight: 1.2,
  },
  "& .ti_le": {
    color: "#b8c0d4",
    fontSize: "1.2rem",
  },
  "&.active": {
    backgroundColor: "rgba(212,175,55,.18)",
  },
}));

const BoxDatCuoc = ({ TYPE_GAME, phien, tinhTrang, vipLevel }) => {
  const titleDatCuocRef = useRef(null);
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
  const [tienCuoc, setTienCuoc] = useState(0);
  const tiLe = betPayoutPercentageData ?? 0;
  const chiTietCuocHienTai = detailedBetHistoryData?.datCuoc ?? [];
  const [chiTietCuocTemp, setChiTietCuocTemp] = useState([]);

  useEffect(() => {
    setChiTietCuocTemp([]);
    setTienCuoc(0);
  }, [phien, vipLevel]);

  useEffect(() => {
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY || tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG) {
      setChiTietCuocTemp([]);
      setTienCuoc(0);
    }
  }, [tinhTrang]);

  const applyTienCuocToPending = (amount) => {
    setTienCuoc((prevDraft) => {
      setChiTietCuocTemp((prev) => syncPendingBetAmount(prev, prevDraft, amount));
      return amount;
    });
  };

  const handleSubmitCuoc = async () => {
    try {
      if (chiTietCuocTemp.length === 0) {
        toast.error("Vui lòng chọn cược");
        return;
      }
      if (chiTietCuocTemp.some((e) => !e.tienCuoc || e.tienCuoc <= 0)) {
        toast.error("Vui lòng chọn tiền cược hợp lệ");
        titleDatCuocRef?.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      setIsLoading(true);

      const results = await GameService.createDatCuoc({
        typeGame: TYPE_GAME,
        data: {
          phien,
          chiTietCuoc: mergeCltxBets(chiTietCuocHienTai, chiTietCuocTemp),
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

  /**
   * Chuyển giá trị chuỗi từ input thành số, sau đó set cho tiền cược
   * @param {String} value
   *
   */
  const handleChangeTienCuoc = (value) => {
    if (value === "" || value === null || value === undefined) {
      applyTienCuocToPending("");
      return;
    }
    let parseValue = parseInt(value, 10);
    if (isNaN(parseValue)) {
      parseValue = "";
    }
    applyTienCuocToPending(parseValue);
  };
  /**
   *
   * @param {*} loaiCuoc Loại Cược : CLTX
   * @param {*} chiTietCuoc Chi tiết cược: T, X
   * @param {*} tienCuoc Số tiền cược (0 = chỉ chọn cửa, gắn tiền sau)
   * @returns
   */

  const handleClickCuocCLTX = ({ loaiCuoc, chiTietCuoc, tienCuoc }) => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      toast.error("Vui lòng đợi phiên mới");
      return;
    }
    const amount = tienCuoc > 0 && _.isNumber(tienCuoc) ? tienCuoc : 0;
    const findItemCuoc = chiTietCuocTemp.find((e) => e.chiTietCuoc === chiTietCuoc && e.loaiCuoc === loaiCuoc);

    if (!findItemCuoc) {
      setChiTietCuocTemp((state) => [...state, { loaiCuoc, chiTietCuoc, tienCuoc: amount }]);
      return;
    }
    if (amount <= 0) {
      if (findItemCuoc.tienCuoc === 0) {
        setChiTietCuocTemp((state) =>
          state.filter((e) => !(e.chiTietCuoc === chiTietCuoc && e.loaiCuoc === loaiCuoc))
        );
      }
      return;
    }
    const newTienCuoc = findItemCuoc.tienCuoc + amount;
    setChiTietCuocTemp((prevState) =>
      prevState.map((obj) =>
        obj.chiTietCuoc === chiTietCuoc && obj.loaiCuoc === loaiCuoc ? { ...obj, tienCuoc: newTienCuoc } : obj
      )
    );
  };
  const handleResetCuoc = () => {
    setChiTietCuocTemp([]);
    setTienCuoc(0);
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
          {LOAI_CUOC.map((item) => {
            const active = !!chiTietCuocTemp.find(
              (e) => e.chiTietCuoc === item.chiTietCuoc && e.loaiCuoc === item.loaiCuoc
            );
            return (
              <ItemCuoc
                key={item.chiTietCuoc}
                className={active ? "active" : ""}
                onClick={() =>
                  handleClickCuocCLTX({ loaiCuoc: item.loaiCuoc, chiTietCuoc: item.chiTietCuoc, tienCuoc })
                }
              >
                <Typography className="loai_cuoc">{item.tenCuoc}</Typography>
                <Typography className="ti_le">{Number(tiLe).toFixed(3)}</Typography>
              </ItemCuoc>
            );
          })}
        </Box>
      </Box>
      <BetMoneyStickyPanel
        tienCuoc={tienCuoc}
        onChangeInput={(e) => handleChangeTienCuoc(e.target.value)}
        onSubmit={handleSubmitCuoc}
        onReset={handleResetCuoc}
        titleRef={titleDatCuocRef}
        isSpinning={tinhTrang === TINH_TRANG_GAME.DANG_QUAY}
      />
    </>
  );
};
export default memo(BoxDatCuoc);
