import BetMoneyStickyPanel from "@/components/games/BetMoneyStickyPanel";
import { GAME_DAT_CUOC_ID } from "@/components/games/StickyBetBar";
import LoadingBox from "@/components/homePage/LoadingBox";
import {
  CHI_TIET_CUOC_GAME,
  DEFAULT_SETTING_GAME,
  LOAI_CUOC,
  LOAI_CUOC_GAME,
  MUC_TIEN_CUOC,
  TINH_TRANG_GAME,
  USER_BET_GAME_HISTORY_PAGE_SIZE,
} from "@/configs/game.xocdia.config";
import useGetBetPayoutPercentage from "@/hooks/useGetBetPayoutPercentage";
import useGetDetailedBetHistory from "@/hooks/useGetDetailedBetHistory";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import GameService from "@/services/GameService";
import convertMoney from "@/utils/convertMoney";
import { convertInputTienCuoc, isNumberKey } from "@/utils/input";
import { mergeCltxBets } from "@/utils/mergeGameBets";
import { toast } from "@/utils/toast";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { memo, useEffect, useRef, useState } from "react";

const ItemCuoc = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "10px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.default,
  position: "relative",
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  border: "1px solid rgba(255,255,255,.12)",
  alignItems: "center",
  color: theme.palette.text.secondary,
  "& .loai_cuoc": {
    fontWeight: 700,
    color: "#e5c05b",
  },
  "& .tien_cuoc": {
    fontWeight: 700,
    color: "#fa8838",
  },
  "&.active-tien_cuoc": {
    backgroundColor: "#d4af37",
    borderColor: "#e5c05b",
    "& .loai_cuoc": {
      color: "#0b1528",
    },
    "& .tien_cuoc": {
      color: "#0b1528",
    },
  },
}));

const BoxDatCuoc = ({ TYPE_GAME = "keno1p", phien, tinhTrang }) => {
  const boxDatCuocRef = useRef(null);
  const titleDatCuocRef = useRef(null);
  const inputDatCuocRef = useRef(null);
  const { data: detailedBetHistoryData, refetch: refetchDetailedBetHistory } = useGetDetailedBetHistory({
    typeGame: TYPE_GAME,
    phien,
  });

  const { data: betPayoutPercentageData } = useGetBetPayoutPercentage({ typeGame: TYPE_GAME });

  const { refetch: refetchUserBetHistory } = useGetUserBetHistory({
    typeGame: TYPE_GAME,
    pageSize: USER_BET_GAME_HISTORY_PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAllowResetBtn, setIsAllowResetBtn] = useState(false);
  const [tienCuoc, setTienCuoc] = useState(0);
  const [chiTietCuocTemp, setChiTietCuocTemp] = useState([]);
  const tiLe = betPayoutPercentageData ?? {
    [CHI_TIET_CUOC_GAME.CHAN]: DEFAULT_SETTING_GAME.BET_PAYOUT_PERCENT,
    [CHI_TIET_CUOC_GAME.HAI_TRANG_HAI_DO]: DEFAULT_SETTING_GAME.HAI_HAI_BET_PAYOUT_PERCENT,
    [CHI_TIET_CUOC_GAME.FULL_DO]: DEFAULT_SETTING_GAME.FULL_BET_PAYOUT_PERCENT,
    [CHI_TIET_CUOC_GAME.FULL_TRANG]: DEFAULT_SETTING_GAME.FULL_BET_PAYOUT_PERCENT,
    [CHI_TIET_CUOC_GAME.LE]: DEFAULT_SETTING_GAME.BET_PAYOUT_PERCENT,
    [CHI_TIET_CUOC_GAME.BA_DO_MOT_TRANG]: DEFAULT_SETTING_GAME.BA_MOT_BET_PAYOUT_PERCENT,
    [CHI_TIET_CUOC_GAME.BA_TRANG_MOT_DO]: DEFAULT_SETTING_GAME.BA_MOT_BET_PAYOUT_PERCENT,
  };
  const chiTietCuocHienTai = detailedBetHistoryData?.datCuoc ?? [];

  useEffect(() => {
    setChiTietCuocTemp([]);
    setTienCuoc(0);
    setIsAllowResetBtn(false);
  }, [phien]);

  useEffect(() => {
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY || tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG) {
      setChiTietCuocTemp([]);
      setTienCuoc(0);
      setIsAllowResetBtn(false);
    }
  }, [tinhTrang]);

  const applyTienCuocToPending = (amount) => {
    setTienCuoc(amount);
    if (!amount || amount <= 0) return;
    setChiTietCuocTemp((prev) => {
      let changed = false;
      const next = prev.map((b) => {
        if (b.tienCuoc === 0) {
          changed = true;
          return { ...b, tienCuoc: amount };
        }
        return b;
      });
      return changed ? next : prev;
    });
    setIsAllowResetBtn(true);
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
          chiTietCuoc: mergeCltxBets(chiTietCuocHienTai, chiTietCuocTemp),
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
  const handleChangeTienCuoc = (e, value) => {
    if (!isNumberKey(e)) {
      e.preventDefault();
      return;
    }
    applyTienCuocToPending(convertInputTienCuoc(value));
  };

  /**
   *
   * @param {*} loaiCuoc Loại Cược : CLTX
   * @param {*} chiTietCuoc Chi tiết cược: T, X
   * @param {*} tienCuoc Số tiền cược (0 = chỉ chọn cửa, gắn tiền sau)
   * @returns
   */
  const handleClickCuoc = ({ loaiCuoc, chiTietCuoc, tienCuoc }) => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      toast.error("Vui lòng đợi phiên mới");
      return;
    }
    const amount = tienCuoc > 0 && _.isNumber(tienCuoc) ? tienCuoc : 0;

    const findItemCuoc = chiTietCuocTemp.find((e) => e.chiTietCuoc === chiTietCuoc && e.loaiCuoc === loaiCuoc);
    if (!findItemCuoc) {
      setChiTietCuocTemp((state) => [...state, { loaiCuoc, chiTietCuoc, tienCuoc: amount }]);
      setIsAllowResetBtn(true);
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
    setIsAllowResetBtn(true);
  };
  /**
   *
   * @param {*} loaiCuoc Loại Cược : CLTX
   * @param {*} chiTietCuoc Chi tiết cược: T, X
   * @returns {Number} Số tiền đang cược
   */

  const convertTienCuocCLTX = ({ loaiCuoc, chiTietCuoc }) => {
    const findItemCuoc = chiTietCuocTemp.find((e) => e.chiTietCuoc === chiTietCuoc && e.loaiCuoc === loaiCuoc);
    if (findItemCuoc) {
      return convertMoney(findItemCuoc.tienCuoc);
    } else {
      return 0;
    }
  };

  /**
   * Reset cược tạm thời về như ban đầu
   */
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

          position: "relative",
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          color: (theme) => theme.palette.text.secondary,
          "& .bet_state": {
            borderBottom: "3px solid #d4af37",
            display: "inline-block",
            fontWeight: 700,
            margin: "0.1rem 0 0.3rem",
          },
        }}
      >
        <Box
          ref={boxDatCuocRef}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0,1fr))", sm: "repeat(2, minmax(0,1fr))" },
            gap: "1rem",
          }}
        >
          {LOAI_CUOC.map((itemLoaiCuoc) => {
            if (itemLoaiCuoc.loaiCuoc === LOAI_CUOC_GAME.CHAN_LE) {
              return (
                <button
                  key={itemLoaiCuoc.chiTietCuoc}
                  className="taste_unit_item "
                  onClick={() =>
                    handleClickCuoc({
                      loaiCuoc: itemLoaiCuoc.loaiCuoc,
                      chiTietCuoc: itemLoaiCuoc.chiTietCuoc,
                      tienCuoc,
                    })
                  }
                >
                  <div className={`taste_unit_img taste_unit_img_${itemLoaiCuoc.chiTietCuoc}`}></div>
                  <div className="taste_unit_odds">x{tiLe[itemLoaiCuoc.chiTietCuoc]}</div>
                  <Typography className="tien_cuoc">
                    {convertTienCuocCLTX({ loaiCuoc: itemLoaiCuoc.loaiCuoc, chiTietCuoc: itemLoaiCuoc.chiTietCuoc })}
                  </Typography>
                </button>
              );
            } else {
              return (
                <button
                  key={itemLoaiCuoc.chiTietCuoc}
                  className="taste_unit_item "
                  onClick={() =>
                    handleClickCuoc({
                      loaiCuoc: itemLoaiCuoc.loaiCuoc,
                      chiTietCuoc: itemLoaiCuoc.chiTietCuoc,
                      tienCuoc,
                    })
                  }
                >
                  <div>
                    <div className="nums_yxx_qw">
                      {itemLoaiCuoc.ketQua.map((item, index) => (
                        <div key={index} className={`taste_unit_item_yxx taste_unit_item_${item} die`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="taste_unit_odds">x{tiLe[itemLoaiCuoc.chiTietCuoc]}</div>
                  <Typography className="tien_cuoc">
                    {convertTienCuocCLTX({ loaiCuoc: itemLoaiCuoc.loaiCuoc, chiTietCuoc: itemLoaiCuoc.chiTietCuoc })}
                  </Typography>
                </button>
              );
            }
          })}
        </Box>

      </Box>
      <BetMoneyStickyPanel
        amounts={MUC_TIEN_CUOC}
        tienCuoc={tienCuoc}
        onSelectAmount={applyTienCuocToPending}
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
