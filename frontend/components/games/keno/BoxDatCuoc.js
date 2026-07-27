import LoadingBox from "@/components/homePage/LoadingBox";
import OutlinedInput from "@/components/input/OutlinedInput";
import {
  LOAI_BI,
  LOAI_CUOC,
  MUC_TIEN_CUOC,
  TINH_TRANG_GAME,
  USER_BET_GAME_HISTORY_PAGE_SIZE,
} from "@/configs/game.keno.config";
import useGetBetPayoutPercentage from "@/hooks/useGetBetPayoutPercentage";
import useGetDetailedBetHistory from "@/hooks/useGetDetailedBetHistory";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import GameService from "@/services/GameService";
import convertMoney from "@/utils/convertMoney";
import { convertInputTienCuoc, isNumberKey } from "@/utils/input";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const BoxContainer = styled(Box)(({ theme }) => ({
  borderRadius: "2rem",
  padding: "2rem",
  marginTop: "1rem",

  backgroundColor: theme.palette.background.default,
  position: "relative",
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  color: theme.palette.text.secondary,
  "& .bet_state": {
    borderBottom: "3px solid red",
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
  const tiLe = betPayoutPercentageData ?? 0;
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
   * @param {*} loaiCuoc Loại Cược : C, L
   * @param {*} loaiBi Loại Bi : 1,2,3,4,5
   * @param {*} tienCuoc Số tiền cược
   * @returns
   */
  const handleClickCuocCLTX = ({ loaiCuoc, loaiBi, tienCuoc }) => {
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

    const findItemCuocByBi = chiTietCuocTemp.find((e) => e.loaiBi === loaiBi);
    // Kiểm tra xem đã cược loại bi này hay chưa
    if (!findItemCuocByBi) {
      const chiTietCuocTemp = {
        loaiCuoc,
        loaiBi,
        tienCuoc,
      };
      setChiTietCuocTemp((state) => [...state, chiTietCuocTemp]);
    } else {
      // Nếu đã tồn tại cược bi này, kiểm tra xem có cược khác loại hay không
      if (loaiCuoc !== findItemCuocByBi.loaiCuoc) {
        toast.error("Bạn chỉ được phép đặt cược 1 bên");
        return;
      } else {
        // Ghi đè cược
        const newTienCuoc = findItemCuocByBi.tienCuoc + tienCuoc;
        setChiTietCuocTemp((prevState) => {
          const newState = prevState.map((obj) => {
            if (obj.loaiCuoc === loaiCuoc && obj.loaiBi === loaiBi) {
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
   * @param {} loaiCuoc Loại Cược : C, L
   * @param {} loaiBi Loại Bi: 1,2,3,4,5
   * @returns {Number} Số tiền đang cược
   */

  const convertTienCuocCLTX = ({ loaiCuoc, loaiBi }) => {
    const findItemCuoc = chiTietCuocTemp.find((e) => e.loaiCuoc === loaiCuoc && e.loaiBi === loaiBi);
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

          backgroundColor: (theme) => theme.palette.background.default,
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
        <h2 className="title">Đặt cược</h2>

        <Box
          ref={boxDatCuocRef}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, minmax(0,1fr))", md: "repeat(2, minmax(0,1fr))" },
            gap: "2rem",
          }}
        >
          {LOAI_BI.map((item, i) => (
            <Box key={i}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Cược bi {item}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: "10px",
                }}
              >
                {LOAI_CUOC.map((itemLoaiCuoc) => (
                  <ItemCuoc
                    key={itemLoaiCuoc.tenCuoc}
                    onClick={() => handleClickCuocCLTX({ loaiCuoc: itemLoaiCuoc.loaiCuoc, loaiBi: item, tienCuoc })}
                  >
                    <Typography className="loai_cuoc">{itemLoaiCuoc.tenCuoc}</Typography>
                    <Typography>x{tiLe}</Typography>
                    <Typography className="tien_cuoc">
                      {convertTienCuocCLTX({ loaiCuoc: itemLoaiCuoc.loaiCuoc, loaiBi: item })}
                    </Typography>
                  </ItemCuoc>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Typography
          sx={{
            fontWeight: "bold",
          }}
          ref={titleDatCuocRef}
        >
          Chọn tiền cược sẵn có
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {MUC_TIEN_CUOC.map((item, i) => (
            <ItemCuoc
              key={item}
              className={tienCuoc == item ? "active-tien_cuoc" : ""}
              onClick={() => setTienCuoc(item)}
            >
              <Typography className="loai_cuoc">{convertMoney(item)}</Typography>
            </ItemCuoc>
          ))}
        </Box>

        <Typography
          sx={{
            fontWeight: "bold",
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
          <Button disabled={tinhTrang === TINH_TRANG_GAME.DANG_QUAY} onClick={handleSubmitCuoc}>
            {tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? "Chờ phiên mới" : "Xác nhận"}
          </Button>

          <Button disabled={!isAllowResetBtn} onClick={handleResetCuoc}>
            Đặt lại
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default memo(BoxDatCuoc);
