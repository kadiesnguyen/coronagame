import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo, useEffect, useRef, useState } from "react";

import LoadingBox from "@/components/homePage/LoadingBox";
import OutlinedInput from "@/components/input/OutlinedInput";
import { LOAI_CUOC_GAME, convertLoaiCuoc, getTiLeDefault } from "@/configs/game.xoso.config";
import { TINH_TRANG_GAME, USER_BET_GAME_HISTORY_PAGE_SIZE } from "@/configs/game.xucxac.config";
import useGetBetPayoutPercentage from "@/hooks/useGetBetPayoutPercentage";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import GameService from "@/services/GameService";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertInputTienCuoc, isNumberKey } from "@/utils/input";
import clsx from "clsx";
import _ from "lodash";
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
  color: "#000000",
  "& .loai_cuoc": {
    color: "#000000",
  },
  "& .tien_cuoc": {
    fontWeight: 700,
    color: "#fa8838",
    "&.new": {
      color: "blue",
    },
  },
  "&.active-tien_cuoc": {
    backgroundColor: "red",
    "& .loai_cuoc": {
      color: "#ffffff",
    },
  },
}));

const createNumberArray = (range) => {
  const { startNumber, endNumber } = range;
  const numberArray = [];
  for (let i = startNumber; i <= endNumber; i++) {
    numberArray.push(i);
  }
  return numberArray;
};

const LIST_TAB_BA_CANG = [
  { tabId: "tab_1", startNumber: 0, endNumber: 99 },
  { tabId: "tab_2", startNumber: 100, endNumber: 199 },
  { tabId: "tab_3", startNumber: 200, endNumber: 299 },
  { tabId: "tab_4", startNumber: 300, endNumber: 399 },
  { tabId: "tab_5", startNumber: 400, endNumber: 499 },
  { tabId: "tab_6", startNumber: 500, endNumber: 599 },
  { tabId: "tab_7", startNumber: 600, endNumber: 699 },
  { tabId: "tab_8", startNumber: 700, endNumber: 799 },
  { tabId: "tab_9", startNumber: 800, endNumber: 899 },
  { tabId: "tab_10", startNumber: 900, endNumber: 999 },
];

const TILE_DEFAULT = Object.fromEntries(
  Object.values(LOAI_CUOC_GAME).map((loaiCuoc) => [loaiCuoc, getTiLeDefault(loaiCuoc)])
);

const BoxDatCuoc = ({ TYPE_GAME, phien, tinhTrang }) => {
  const titleDatCuocRef = useRef(null);
  const titleChonSoRef = useRef(null);
  const inputDatCuocRef = useRef(null);
  const [loaiCuocGame, setLoaiCuocGame] = useState(LOAI_CUOC_GAME.LO);
  const [listSoCuoc, setListSoCuoc] = useState([]);
  const [tabBaCangSelected, setTabBaCangSelected] = useState(LIST_TAB_BA_CANG[0].tabId);
  const listNumbersBaCang = (() => {
    const findItemTab = LIST_TAB_BA_CANG.find((item) => item.tabId === tabBaCangSelected);
    const { startNumber, endNumber } = findItemTab;
    return createNumberArray({ startNumber, endNumber });
  })();

  const { data: betPayoutPercentageData } = useGetBetPayoutPercentage({ typeGame: TYPE_GAME });
  const { refetch: refetchUserBetHistory } = useGetUserBetHistory({
    typeGame: TYPE_GAME,
    pageSize: USER_BET_GAME_HISTORY_PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tienCuoc, setTienCuoc] = useState(0);
  const tiLe = betPayoutPercentageData ?? TILE_DEFAULT;

  useEffect(() => {
    // Re-fetch lịch sử cược khi phiên đã hoàn tất
    if (tinhTrang === TINH_TRANG_GAME.HOAN_TAT) {
      refetchUserBetHistory();
    }
  }, [tinhTrang]);

  // Reset số cược khi chọn loại cược khác
  useEffect(() => {
    setListSoCuoc([]);
  }, [loaiCuocGame]);

  /**
   * Xử lý cược
   */
  const handleSubmitCuoc = async () => {
    try {
      if (tienCuoc <= 0) {
        toast.error("Vui lòng chọn tiền cược hợp lệ");
        inputDatCuocRef?.current?.focus();
        return;
      }
      if (listSoCuoc.length === 0) {
        toast.error("Vui lòng chọn cược");
        titleChonSoRef?.current?.scrollIntoView({ behavior: "smooth" });

        return;
      }
      if (loaiCuocGame === LOAI_CUOC_GAME.LO_XIEN_2) {
        if (listSoCuoc.length < 2) {
          toast.error("Bạn phải chọn tối thiểu 2 số");
          titleChonSoRef?.current?.scrollIntoView({ behavior: "smooth" });

          return;
        }
      }
      if (loaiCuocGame === LOAI_CUOC_GAME.LO_XIEN_3) {
        if (listSoCuoc.length < 3) {
          toast.error("Bạn phải chọn tối thiểu 3 số");
          titleChonSoRef?.current?.scrollIntoView({ behavior: "smooth" });

          return;
        }
      }
      if (loaiCuocGame === LOAI_CUOC_GAME.LO_XIEN_4) {
        if (listSoCuoc.length < 4) {
          toast.error("Bạn phải chọn tối thiểu 4 số");
          titleChonSoRef?.current?.scrollIntoView({ behavior: "smooth" });

          return;
        }
      }
      setIsLoading(true);
      const results = await GameService.createDatCuoc({
        typeGame: TYPE_GAME,
        data: {
          loaiCuoc: loaiCuocGame,
          phien,
          listSoCuoc,
          tienCuoc,
        },
      });
      // Re-fetch lại lịch sử đặt cược cá nhân
      refetchUserBetHistory();
      handleResetCuoc();
      toast.success(results?.data?.message ?? "Đặt cược thành công");
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
   * Reset cược tạm thời về như ban đầu
   */
  const handleResetCuoc = () => {
    setListSoCuoc([]);
    setTienCuoc(0);
  };

  /**
   * Xử lý chọn số cược
   */
  const handleChonSoCuoc = (number) => {
    if (listSoCuoc.includes(number)) {
      setListSoCuoc((prev) => {
        const copyPrev = [...prev];
        _.remove(copyPrev, (n) => n === number);
        return copyPrev;
      });
    } else {
      if (
        loaiCuocGame === LOAI_CUOC_GAME.LO ||
        loaiCuocGame === LOAI_CUOC_GAME.DE ||
        loaiCuocGame === LOAI_CUOC_GAME.BA_CANG
      ) {
        if (listSoCuoc.length >= 10) {
          toast.error("Bạn chỉ được chọn tối đa 10 số");
          return;
        }
      }
      if (loaiCuocGame === LOAI_CUOC_GAME.LO_XIEN_2) {
        if (listSoCuoc.length >= 2) {
          toast.error("Bạn chỉ được chọn tối đa 2 số");
          return;
        }
      }
      if (loaiCuocGame === LOAI_CUOC_GAME.LO_XIEN_3) {
        if (listSoCuoc.length >= 3) {
          toast.error("Bạn chỉ được chọn tối đa 3 số");
          return;
        }
      }
      if (loaiCuocGame === LOAI_CUOC_GAME.LO_XIEN_4) {
        if (listSoCuoc.length >= 4) {
          toast.error("Bạn chỉ được chọn tối đa 4 số");
          return;
        }
      }

      setListSoCuoc((prev) => [...prev, number]);
    }
  };
  return (
    <>
      {isLoading && <LoadingBox isLoading={isLoading} />}
      <Box
        sx={{
          paddingTop: "3.6rem",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, minmax(0,1fr))",
            sm: "repeat(4, minmax(0,1fr))",
            md: "repeat(6, minmax(0,1fr))",
          },
          flexWrap: "wrap",
          gap: "1rem",
          "& .tab-item": {
            "&.active": {
              background: "red",
              boxShadow: "0 0 16px rgba(0, 0, 0, 0.25)",
              fontWeight: 600,
              color: "#fff",
            },
            cursor: "pointer",
            padding: "1rem",
            fontSize: "1.2rem",
            color: "#333",
            backgroundColor: "#e8e7e8",
            borderRadius: "1rem",
            minWidth: "7rem",
            textAlign: "center",
            lineHeight: "1.3rem",
          },
        }}
      >
        {Object.values(LOAI_CUOC_GAME).map((loaiCuoc) => (
          <Box
            key={loaiCuoc}
            onClick={() => setLoaiCuocGame(loaiCuoc)}
            className={clsx("tab-item", {
              active: loaiCuocGame === loaiCuoc,
            })}
          >
            {convertLoaiCuoc(loaiCuoc)}
          </Box>
        ))}
      </Box>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitCuoc();
        }}
      >
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
          }}
        >
          <Typography sx={{}} ref={titleDatCuocRef}>
            Số tiền cược
          </Typography>

          <OutlinedInput
            inputRef={inputDatCuocRef}
            value={tienCuoc}
            onChange={(e) => {
              handleChangeTienCuoc(e, e.target.value);
            }}
            placeholder="Số tiền"
            size="small"
            type="text"
            fullWidth
            onWheel={(e) => e.target.blur()}
          />
          <Typography component={"div"} sx={{}}>
            Đã chọn{" "}
            <Typography
              component={"span"}
              sx={{
                color: "red",
              }}
            >
              {listSoCuoc.length}
            </Typography>
            , Tổng tiền cược{" "}
            <Typography
              component={"span"}
              sx={{
                color: "red",
              }}
            >
              {convertJSXMoney(tienCuoc * listSoCuoc.length)}
            </Typography>
          </Typography>
          <Typography sx={{}}>Tỉ lệ cược 1 : {tiLe[loaiCuocGame]}</Typography>

          <Button
            type="submit"
            disabled={tinhTrang === TINH_TRANG_GAME.DANG_QUAY}
            // onClick={handleSubmitCuoc}
            sx={{
              fontSize: "2rem",
            }}
          >
            {tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? "Chờ phiên mới" : "Đặt lệnh"}
          </Button>
        </Box>
      </form>

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
        }}
      >
        <h2 className="title" ref={titleChonSoRef}>
          Chọn số
        </h2>
        {[LOAI_CUOC_GAME.BA_CANG].includes(loaiCuocGame) && (
          <>
            <Box
              className="tab-3cang"
              sx={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: {
                  xs: "repeat(6, minmax(0,1fr))",
                  sm: "repeat(8, minmax(0,1fr))",
                  md: "repeat(10, minmax(0,1fr))",
                },
              }}
            >
              {LIST_TAB_BA_CANG.map((tabItem) => (
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => setTabBaCangSelected(tabItem.tabId)}
                  key={tabItem.tabId}
                  className={clsx("item", {
                    active: tabBaCangSelected === tabItem.tabId,
                  })}
                >
                  <Typography>
                    {tabItem.startNumber < 10
                      ? "00" + tabItem.startNumber
                      : tabItem.startNumber < 100
                      ? "0" + tabItem.startNumber
                      : tabItem.startNumber}
                  </Typography>
                  <Typography> ━ </Typography>
                  <Typography>
                    {" "}
                    {tabItem.endNumber < 10
                      ? "00" + tabItem.endNumber
                      : tabItem.endNumber < 100
                      ? "0" + tabItem.endNumber
                      : tabItem.endNumber}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: {
                  xs: "repeat(6, minmax(0,1fr))",
                  sm: "repeat(8, minmax(0,1fr))",
                  md: "repeat(10, minmax(0,1fr))",
                },
              }}
            >
              {listNumbersBaCang.map((number) => (
                <ItemCuoc
                  key={number}
                  className={clsx({
                    "active-tien_cuoc": listSoCuoc.includes(number),
                  })}
                  onClick={() => handleChonSoCuoc(number)}
                >
                  <Typography className="loai_cuoc">
                    {number < 10 ? "00" + number : number < 100 ? "0" + number : number}
                  </Typography>
                </ItemCuoc>
              ))}
            </Box>
          </>
        )}
        {[
          LOAI_CUOC_GAME.LO,
          LOAI_CUOC_GAME.DE,
          LOAI_CUOC_GAME.LO_XIEN_2,
          LOAI_CUOC_GAME.LO_XIEN_3,
          LOAI_CUOC_GAME.LO_XIEN_4,
        ].includes(loaiCuocGame) && (
          <Box
            sx={{
              display: "grid",
              gap: "0.5rem",
              gridTemplateColumns: {
                xs: "repeat(6, minmax(0,1fr))",
                sm: "repeat(8, minmax(0,1fr))",
                md: "repeat(10, minmax(0,1fr))",
              },
            }}
          >
            {createNumberArray({ startNumber: 0, endNumber: 99 }).map((number) => (
              <ItemCuoc
                key={number}
                className={clsx({
                  "active-tien_cuoc": listSoCuoc.includes(number),
                })}
                onClick={() => handleChonSoCuoc(number)}
              >
                <Typography className="loai_cuoc">{number < 10 ? "0" + number : number}</Typography>
              </ItemCuoc>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};
export default memo(BoxDatCuoc);
