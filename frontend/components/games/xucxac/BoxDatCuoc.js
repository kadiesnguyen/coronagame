import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo, useEffect, useRef, useState } from "react";

import BetMoneyStickyPanel from "@/components/games/BetMoneyStickyPanel";
import { GAME_DAT_CUOC_ID } from "@/components/games/StickyBetBar";
import LoadingBox from "@/components/homePage/LoadingBox";
import {
  LOAI_CUOC,
  MUC_TIEN_CUOC,
  TINH_TRANG_GAME,
  USER_BET_GAME_HISTORY_PAGE_SIZE,
} from "@/configs/game.xucxac.config";
import useGetBetPayoutPercentage from "@/hooks/useGetBetPayoutPercentage";
import useGetDetailedBetHistory from "@/hooks/useGetDetailedBetHistory";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import GameService from "@/services/GameService";
import convertMoney from "@/utils/convertMoney";
import { mergeCltxBets } from "@/utils/mergeGameBets";
import { toast } from "@/utils/toast";
import _ from "lodash";
const BoxContainer = styled(Box)(({ theme }) => ({
  borderRadius: "20px",
  padding: "20px",
  marginTop: "10px",

  backgroundColor: theme.palette.background.default,
  position: "relative",
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  color: theme.palette.text.secondary,
  "& .bet_state": {
    borderBottom: "3px solid #d4af37",
    display: "inline-block",
    fontWeight: 700,
    margin: "0.1rem 0 0.3rem",
  },
}));
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
    "&.new": {
      color: "blue",
    },
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

const BoxDatCuoc = ({ TYPE_GAME, phien, tinhTrang }) => {
  const titleDatCuocRef = useRef(null);
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
  const [tienCuoc, setTienCuoc] = useState(0);
  const tiLe = betPayoutPercentageData ?? 0;
  const chiTietCuocHienTai = detailedBetHistoryData?.datCuoc ?? [];
  const [chiTietCuocTemp, setChiTietCuocTemp] = useState([]);

  useEffect(() => {
    setChiTietCuocTemp([]);
    setTienCuoc(0);
  }, [phien]);

  useEffect(() => {
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY || tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG) {
      setChiTietCuocTemp([]);
      setTienCuoc(0);
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
          "& .bet_state": {
            borderBottom: "3px solid #d4af37",
            display: "inline-block",
            fontWeight: 700,
            margin: "0.1rem 0 0.3rem",
          },
        }}
      >
        <h2 className="title">Đặt cược</h2>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
            gap: "10px",
          }}
        >
          {LOAI_CUOC.map((item, i) => (
            <ItemCuoc
              key={item.tenCuoc}
              onClick={() => handleClickCuocCLTX({ loaiCuoc: item.loaiCuoc, chiTietCuoc: item.chiTietCuoc, tienCuoc })}
            >
              <Typography className="loai_cuoc">{item.tenCuoc}</Typography>
              <Typography>x{tiLe}</Typography>
              <Typography className={"tien_cuoc"}>
                {convertTienCuocCLTX({ loaiCuoc: item.loaiCuoc, chiTietCuoc: item.chiTietCuoc })}
              </Typography>
            </ItemCuoc>
          ))}
        </Box>

      </Box>
      <BetMoneyStickyPanel
        amounts={MUC_TIEN_CUOC}
        tienCuoc={tienCuoc}
        onSelectAmount={applyTienCuocToPending}
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
