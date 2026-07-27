import LoadingBox from "@/components/homePage/LoadingBox";
import OutlinedInput from "@/components/input/OutlinedInput";
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
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ItemCuoc = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "10px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.default,
  position: "relative",
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  border: "1px solid #e5e5e5",
  alignItems: "center",
  color: theme.palette.text.secondary,
  "& .loai_cuoc": {
    fontWeight: 700,
    color: "red",
  },
  "& .tien_cuoc": {
    fontWeight: 700,
    color: "#fa8838",
  },
  "&.active-tien_cuoc": {
    backgroundColor: "red",
    "& .loai_cuoc": {
      color: "#ffffff",
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
  const [chiTietCuocTemp, setChiTietCuocTemp] = useState(detailedBetHistoryData?.datCuoc ?? []);
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
    // Reset lịch sử cược khi phiên bắt đầu quay
    if (tinhTrang === TINH_TRANG_GAME.DANG_QUAY) {
      handleResetCuoc();
    }
    // Reset lịch sử cược khi phiên đã hoàn tất
    else if (tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG) {
      setChiTietCuocTemp([]);
    }
  }, [tinhTrang]);

  // Đồng bộ lịch sử cược khi thay đổi dữ liệu
  useEffect(() => {
    if (detailedBetHistoryData) {
      setChiTietCuocTemp(detailedBetHistoryData.datCuoc);
    } else {
      setChiTietCuocTemp([]);
    }
  }, [detailedBetHistoryData]);

  const handleSubmitCuoc = async () => {
    try {
      if (chiTietCuocTemp.length === 0) {
        toast.error("Vui lòng chọn cược");
        boxDatCuocRef?.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      setIsLoading(true);
      const results = await GameService.createDatCuoc({
        typeGame: TYPE_GAME,
        data: {
          phien,
          chiTietCuoc: chiTietCuocTemp,
        },
      });
      await refetchDetailedBetHistory();
      refetchUserBetHistory();
      toast.success(results?.data?.message ?? "Đặt cược thành công");
      handleResetCuoc();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Lỗi hệ thống: không thể cược");
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
    let parseValue = convertInputTienCuoc(value);
    setTienCuoc(parseValue);
  };

  /**
   *
   * @param {*} loaiCuoc Loại Cược : CLTX
   * @param {*} chiTietCuoc Chi tiết cược: T, X
   * @param {*} tienCuoc Số tiền cược
   * @returns
   */
  const handleClickCuoc = ({ loaiCuoc, chiTietCuoc, tienCuoc }) => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      toast.error("Vui lòng đợi phiên mới");
      return;
    }
    if (!tienCuoc || tienCuoc <= 0 || !_.isNumber(tienCuoc)) {
      toast.error("Vui lòng chọn tiền cược hợp lệ");
      titleDatCuocRef?.current?.scrollIntoView({ behavior: "smooth" });
      inputDatCuocRef?.current?.focus();
      return;
    }

    const findItemCuoc = chiTietCuocTemp.find((e) => e.chiTietCuoc === chiTietCuoc && e.loaiCuoc === loaiCuoc);
    // Kiểm tra xem đã cược loại bi này hay chưa
    if (!findItemCuoc) {
      const chiTietCuocTemp = {
        loaiCuoc,
        chiTietCuoc,
        tienCuoc,
      };
      setChiTietCuocTemp((state) => [...state, chiTietCuocTemp]);
    } else {
      if (!findItemCuoc) {
        toast.error("Bạn chỉ được phép đặt cược 1 bên");
        return;
      } else {
        // Ghi đè cược
        // Ghi đè cược cũ
        const newTienCuoc = findItemCuoc.tienCuoc + tienCuoc;
        setChiTietCuocTemp((prevState) => {
          const newState = prevState.map((obj) => {
            if (obj.chiTietCuoc === chiTietCuoc && obj.loaiCuoc === loaiCuoc) {
              return { ...obj, tienCuoc: newTienCuoc };
            }
            return obj;
          });

          return newState;
        });
      }
    }
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
    setChiTietCuocTemp(chiTietCuocHienTai);
    setTienCuoc(0);
    setIsAllowResetBtn(false);
  };
  return (
    <>
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Box
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
            borderBottom: "3px solid red",
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

        <Box
          ref={titleDatCuocRef}
          className="bet_taste_chips"
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {/* Tesst */}
          {MUC_TIEN_CUOC.map((item, i) => (
            <div
              key={item.amount}
              className={tienCuoc == item.amount ? "taste_chips_swiper_item active" : "taste_chips_swiper_item"}
              onClick={() => setTienCuoc(item.amount)}
            >
              <div className={"taste_chip"}>
                <div className={`taste_chip_base taste_chip_${item.typeChip}`}>
                  <div className="item_chip_num">
                    <span>{convertMoney(item.amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Box>

        <Typography
          sx={{
            fontWeight: "bold",
            color: "#c1e4ff",
          }}
        >
          Hoặc nhập số tiền bất kỳ ở dưới
        </Typography>
        <OutlinedInput
          inputRef={inputDatCuocRef}
          value={tienCuoc}
          onChange={(e) => handleChangeTienCuoc(e, e.target.value)}
          onWheel={(e) => e.target.blur()}
          placeholder="Số tiền"
          size="small"
          type="text"
          fullWidth
        />
        <Box
          className="bet_taste_info"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            "& > button": {
              maxWidth: "20rem",
              width: "100%",
            },
          }}
        >
          <button
            className={tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? "bet_taste_reset_button" : "bet_taste_submit_button"}
            disabled={tinhTrang === TINH_TRANG_GAME.DANG_QUAY}
            onClick={handleSubmitCuoc}
          >
            {tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? "Chờ phiên mới" : "Xác nhận"}
          </button>

          <button
            className={isAllowResetBtn ? "bet_taste_submit_button" : "bet_taste_reset_button"}
            disabled={!isAllowResetBtn}
            onClick={handleResetCuoc}
          >
            Đặt lại
          </button>
        </Box>
      </Box>
    </>
  );
};
export default memo(BoxDatCuoc);
