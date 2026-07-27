import CountdownTimer from "@/components/games/xoso/CountdownTimer";
import { TINH_TRANG_GAME } from "@/configs/game.xoso.config";
import SocketContext from "@/context/socket";
import useGetDetailedGameHistory from "@/hooks/admin/useGetDetailedGameHistory";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangGameXoSo } from "@/utils/convertTinhTrang";
import { generateRandomNumberString } from "@/utils/xoso";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const DEFAULT_RESULT = [
  {
    type: "DB",
    data: ["xxxxx"],
    length: 5,
  },
  {
    type: "1",
    data: ["xxxxx"],
    length: 5,
  },
  {
    type: "2",
    data: ["xxxxx", "xxxxx"],
    length: 5,
  },
  {
    type: "3",
    data: ["xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
    length: 5,
  },
  {
    type: "4",
    data: ["xxxx", "xxxx", "xxxx", "xxxx"],
    length: 4,
  },
  {
    type: "5",
    data: ["xxxx", "xxxx", "xxxx", "xxxx", "xxxx", "xxxx"],
    length: 4,
  },
  {
    type: "6",
    data: ["xxx", "xxx", "xxx"],
    length: 3,
  },
  {
    type: "7",
    data: ["xx", "xx", "xx", "xx"],
    length: 2,
  },
];

const ChiTietPhien = ({ ID, TYPE_GAME }) => {
  const {
    data: dataQuery,
    isLoading,
    refetch,
  } = useGetDetailedGameHistory({
    typeGame: TYPE_GAME,
    id: ID,
  });
  const { socket } = useContext(SocketContext);
  const [time, setTime] = useState(0);
  const [phien, setPhien] = useState(dataQuery?.phien ?? 0);
  const [ketQua, setKetQua] = useState(dataQuery?.ketQua?.length > 0 ? dataQuery.ketQua : DEFAULT_RESULT);
  const [ketQuaDieuChinh, setKetQuaDieuChinh] = useState(DEFAULT_RESULT);
  const [ketQuaDieuChinhTam, setKetQuaDieuChinhTam] = useState(ketQuaDieuChinh);
  const [isDieuChinh, setIsDieuChinh] = useState(false);
  const [isOpenDieuChinh, setIsOpenDieuChinh] = useState(false);
  const [tinhTrang, setTinhTrang] = useState(dataQuery?.tinhTrang ?? TINH_TRANG_GAME.DANG_CHO);

  useEffect(() => {
    if (dataQuery) {
      // Reset kết quả
      const { phien, tinhTrang, ketQua } = dataQuery;
      setPhien(phien);
      setTinhTrang(tinhTrang);
      setIsDieuChinh(false);
      setIsOpenDieuChinh(false);
      setKetQua(ketQua.length === 0 ? DEFAULT_RESULT : ketQua);
      setKetQuaDieuChinh(DEFAULT_RESULT);
      setKetQuaDieuChinhTam(DEFAULT_RESULT);
    }
  }, [dataQuery]);

  useEffect(() => {
    if (!isOpenDieuChinh) {
      setKetQuaDieuChinhTam(ketQuaDieuChinh);
    }
  }, [ketQuaDieuChinh]);

  useEffect(() => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      setIsOpenDieuChinh(false);
    }
  }, [tinhTrang]);
  useEffect(() => {
    if (socket && phien) {
      socket.emit(`${TYPE_GAME}:join-room-admin`);
      socket.on(`${TYPE_GAME}:admin:refetch-data-chi-tiet-phien-game`, ({ phien }) => {
        if (phien == ID) {
          refetch();
        }
      });
      socket.on(`${TYPE_GAME}:admin:timer`, (data) => {
        if (phien === data.phien) {
          setTime(data.current_time);
        }
      });
      socket.on(`${TYPE_GAME}:admin:ketqua`, (data) => {
        if (data?.ketQuaRandom && data?.phien === phien) {
          setKetQua(data?.ketQuaRandom);
        }
      });
      socket.on(`${TYPE_GAME}:admin:batDauGame`, (data) => {
        if (phien === data?.phien) {
          setTinhTrang(TINH_TRANG_GAME.DANG_CHO);
        }
      });
      socket.on(`${TYPE_GAME}:admin:batDauQuay`, (data) => {
        if (phien === data?.phien) {
          setTinhTrang(TINH_TRANG_GAME.DANG_QUAY);
        }
      });
      socket.on(`${TYPE_GAME}:admin:chuanBiQuay`, (data) => {
        if (phien === data?.phien) {
          setTinhTrang(TINH_TRANG_GAME.CHUAN_BI_QUAY);
        }
      });
      socket.on(`${TYPE_GAME}:admin:dungQuay`, (data) => {
        if (phien === data?.phien) {
          setTinhTrang(TINH_TRANG_GAME.DANG_TRA_THUONG);
        }
      });
      socket.on(`${TYPE_GAME}:admin:hoanTatGame`, (data) => {
        if (phien === data?.phien) {
          setTinhTrang(TINH_TRANG_GAME.HOAN_TAT);
          setIsDieuChinh(false);
        }
      });
      socket.on(`${TYPE_GAME}:admin:hien-thi-ket-qua-dieu-chinh`, ({ ketQua, phienHienTai }) => {
        if (phien === phienHienTai) {
          setKetQuaDieuChinh(ketQua);
          setIsDieuChinh(true);
        } else {
          setKetQuaDieuChinh(DEFAULT_RESULT);
          setIsDieuChinh(false);
        }
      });
      return () => {
        socket.off(`${TYPE_GAME}:admin:refetch-data-chi-tiet-phien-game`);
        socket.off(`${TYPE_GAME}:admin:timer`);
        socket.off(`${TYPE_GAME}:admin:ketqua`);
        socket.off(`${TYPE_GAME}:admin:hien-thi-ket-qua-dieu-chinh`);
        socket.off(`${TYPE_GAME}:admin:batDauGame`);
        socket.off(`${TYPE_GAME}:admin:batDauQuay`);
        socket.off(`${TYPE_GAME}:admin:dungQuay`);
        socket.off(`${TYPE_GAME}:admin:hoanTatGame`);
      };
    }
  }, [socket, phien]);

  const handleRandomKetQua = () => {
    if (!isDieuChinh) {
      setKetQuaDieuChinh([
        {
          type: "DB",
          data: Array.from({ length: 1 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "1",
          data: Array.from({ length: 1 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "2",
          data: Array.from({ length: 2 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "3",
          data: Array.from({ length: 6 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "4",
          data: Array.from({ length: 4 }).map((_, index) => generateRandomNumberString(4)),
        },
        {
          type: "5",
          data: Array.from({ length: 6 }).map((_, index) => generateRandomNumberString(4)),
        },
        {
          type: "6",
          data: Array.from({ length: 3 }).map((_, index) => generateRandomNumberString(3)),
        },
        {
          type: "7",
          data: Array.from({ length: 4 }).map((_, index) => generateRandomNumberString(2)),
        },
      ]);
    } else {
      setKetQuaDieuChinhTam([
        {
          type: "DB",
          data: Array.from({ length: 1 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "1",
          data: Array.from({ length: 1 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "2",
          data: Array.from({ length: 2 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "3",
          data: Array.from({ length: 6 }).map((_, index) => generateRandomNumberString(5)),
        },
        {
          type: "4",
          data: Array.from({ length: 4 }).map((_, index) => generateRandomNumberString(4)),
        },
        {
          type: "5",
          data: Array.from({ length: 6 }).map((_, index) => generateRandomNumberString(4)),
        },
        {
          type: "6",
          data: Array.from({ length: 3 }).map((_, index) => generateRandomNumberString(3)),
        },
        {
          type: "7",
          data: Array.from({ length: 4 }).map((_, index) => generateRandomNumberString(2)),
        },
      ]);
    }
  };

  const handleChangeKetQua = (value, type, position = 0) => {
    if (!isDieuChinh) {
      setKetQuaDieuChinh((prev) => {
        // find type
        const copyPrev = JSON.parse(JSON.stringify(prev));
        const findType = copyPrev.find((item) => item.type === type);
        if (findType) {
          const updatedData = [...findType.data];
          updatedData[position] = value;
          findType.data = updatedData;
        }

        return copyPrev;
      });
    } else {
      setKetQuaDieuChinhTam((prev) => {
        // find type
        const copyPrev = JSON.parse(JSON.stringify(prev));
        const findType = copyPrev.find((item) => item.type === type);
        if (findType) {
          const updatedData = [...findType.data];
          updatedData[position] = value;
          findType.data = updatedData;
        }

        return copyPrev;
      });
    }
  };

  const handleClickConfirmDieuChinhKetQua = (ketQuaDieuChinh) => {
    // Validate ket qua
    for (const { type, data } of ketQuaDieuChinh) {
      const findRequiredLength = DEFAULT_RESULT.find((item) => item.type === type)?.length ?? 0;
      if (!findRequiredLength) {
        toast.error("Lỗi điều chỉnh");
        return;
      }
      // Validate chiều dài
      for (const item of data) {
        if (item.length !== findRequiredLength) {
          toast.error(`Giải ${type} phải là ${findRequiredLength} kí tự!`);
          return;
        }
      }

      // Validate kiểu số
      for (const item of data.join("").split("")) {
        const convertToNumber = parseInt(item);
        if (_.isNaN(convertToNumber)) {
          toast.error(`Giải ${type} chứa kí tự không hợp lệ!`);
          return;
        }
      }
    }

    if (socket) {
      socket.emit(`${TYPE_GAME}:admin:set-ket-qua-dieu-chinh`, ketQuaDieuChinh);
      setKetQuaDieuChinhTam(ketQuaDieuChinh);
      toast.success("Điều chỉnh thành công");
    }
  };

  return (
    <>
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Chi Tiết Phiên Game
      </h1>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {isLoading && <CircularProgress color="inherit" />}
        {dataQuery && (
          <>
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Phiên: {phien}
            </Typography>
            <Typography
              component={"div"}
              sx={{
                fontWeight: "bold",
              }}
            >
              Tình trạng: {convertJSXTinhTrangGameXoSo(tinhTrang)}
            </Typography>
            {tinhTrang === TINH_TRANG_GAME.DANG_CHO && (
              <>
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Thời gian còn lại
                </Typography>
                <CountdownTimer countdownTime={time} />
              </>
            )}
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Kết quả:
            </Typography>
            {tinhTrang === TINH_TRANG_GAME.DANG_CHO ? (
              <Button
                onClick={() => setIsOpenDieuChinh(!isOpenDieuChinh)}
                sx={{
                  marginTop: "10px",
                }}
              >
                {isOpenDieuChinh ? "Đóng" : "Mở"} bảng chọn kết quả
              </Button>
            ) : null}

            {isOpenDieuChinh && (
              <>
                <Button
                  onClick={() => handleRandomKetQua()}
                  sx={{
                    marginTop: "10px",
                  }}
                >
                  Random kết quả
                </Button>
                <Button
                  onClick={() => handleClickConfirmDieuChinhKetQua(isDieuChinh ? ketQuaDieuChinhTam : ketQuaDieuChinh)}
                  sx={{
                    marginTop: "10px",
                  }}
                >
                  Xác nhận kết quả
                </Button>

                <table
                  id="table-xsmb"
                  className="table-result table table-bordered table-striped table-xsmb"
                  style={{
                    maxWidth: "60rem",
                    fontSize: "1.3rem",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "10%" }}>ĐB</th>
                      <td>
                        <span id="mb_prize_0" className="special-prize div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => {
                              handleChangeKetQua(e.target.value, "DB");
                            }}
                            value={isDieuChinh ? ketQuaDieuChinhTam[0].data[0] : ketQuaDieuChinh[0].data[0]}
                            name="DB"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td>
                        <span id="mb_prize_1" className="prize1 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "1")}
                            value={isDieuChinh ? ketQuaDieuChinhTam[1].data[0] : ketQuaDieuChinh[1].data[0]}
                            name="1"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>
                        <span id="mb_prize_2" className="prize2 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "2", 0)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[2].data[0] : ketQuaDieuChinh[2].data[0]}
                            name="2-0"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_3" className="prize2 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "2", 1)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[2].data[1] : ketQuaDieuChinh[2].data[1]}
                            name="2-1"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td>
                        <span id="mb_prize_4" className="prize3 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "3", 0)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[3].data[0] : ketQuaDieuChinh[3].data[0]}
                            name="3-0"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_5" className="prize3 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "3", 1)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[3].data[1] : ketQuaDieuChinh[3].data[1]}
                            name="3-1"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_6" className="prize3 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "3", 2)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[3].data[2] : ketQuaDieuChinh[3].data[2]}
                            name="3-2"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_7" className="prize3 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "3", 3)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[3].data[3] : ketQuaDieuChinh[3].data[3]}
                            name="3-3"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_8" className="prize3 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "3", 4)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[3].data[4] : ketQuaDieuChinh[3].data[4]}
                            name="3-4"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_9" className="prize3 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "3", 5)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[3].data[5] : ketQuaDieuChinh[3].data[5]}
                            name="3-5"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>4</th>
                      <td>
                        <span id="mb_prize_10" className="prize4 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "4", 0)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[4].data[0] : ketQuaDieuChinh[4].data[0]}
                            name="4-0"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_11" className="prize4 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "4", 1)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[4].data[1] : ketQuaDieuChinh[4].data[1]}
                            name="4-1"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_12" className="prize4 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "4", 2)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[4].data[2] : ketQuaDieuChinh[4].data[2]}
                            name="4-2"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_13" className="prize4 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "4", 3)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[4].data[3] : ketQuaDieuChinh[4].data[3]}
                            name="4-3"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>5</th>
                      <td>
                        <span id="mb_prize_14" className="prize5 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "5", 0)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[5].data[0] : ketQuaDieuChinh[5].data[0]}
                            name="5-0"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_15" className="prize5 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "5", 1)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[5].data[1] : ketQuaDieuChinh[5].data[1]}
                            name="5-1"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_16" className="prize5 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "5", 2)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[5].data[2] : ketQuaDieuChinh[5].data[2]}
                            name="5-2"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_17" className="prize5 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "5", 3)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[5].data[3] : ketQuaDieuChinh[5].data[3]}
                            name="5-3"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_18" className="prize5 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "5", 4)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[5].data[4] : ketQuaDieuChinh[5].data[4]}
                            name="5-4"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_19" className="prize5 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "5", 5)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[5].data[5] : ketQuaDieuChinh[5].data[5]}
                            name="5-5"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>6</th>
                      <td>
                        <span id="mb_prize_20" className="prize6 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "6", 0)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[6].data[0] : ketQuaDieuChinh[6].data[0]}
                            name="6-0"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_21" className="prize6 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "6", 1)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[6].data[1] : ketQuaDieuChinh[6].data[1]}
                            name="6-1"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_22" className="prize6 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "6", 2)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[6].data[2] : ketQuaDieuChinh[6].data[2]}
                            name="6-2"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>7</th>
                      <td>
                        <span id="mb_prize_23" className="prize7 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "7", 0)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[7].data[0] : ketQuaDieuChinh[7].data[0]}
                            name="7-0"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_24" className="prize7 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "7", 1)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[7].data[1] : ketQuaDieuChinh[7].data[1]}
                            name="7-1"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_25" className="prize7 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "7", 2)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[7].data[2] : ketQuaDieuChinh[7].data[2]}
                            name="7-2"
                            style={{ width: "60px" }}
                          />
                        </span>
                        <span id="mb_prize_26" className="prize7 div-horizontal">
                          <input
                            type="text"
                            onChange={(e) => handleChangeKetQua(e.target.value, "7", 3)}
                            value={isDieuChinh ? ketQuaDieuChinhTam[7].data[3] : ketQuaDieuChinh[7].data[3]}
                            name="7-3"
                            style={{ width: "60px" }}
                          />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {ketQua && ketQua.length > 0 && tinhTrang !== TINH_TRANG_GAME.DANG_CHO && (
              <table
                id="table-xsmb"
                className="table-result table table-bordered table-striped table-xsmb"
                style={{
                  maxWidth: "60rem",
                  fontSize: "1.3rem",
                }}
              >
                <tbody>
                  <tr>
                    <th style={{ width: "10%" }}>ĐB</th>
                    <td>
                      <span id="mb_prize_0" className="special-prize div-horizontal">
                        {ketQua[0].data[0]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>1</th>
                    <td>
                      <span id="mb_prize_1" className="prize1 div-horizontal">
                        {ketQua[1].data[0]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>
                      <span id="mb_prize_2" className="prize2 div-horizontal">
                        {ketQua[2].data[0]}
                      </span>
                      <span id="mb_prize_3" className="prize2 div-horizontal">
                        {ketQua[2].data[1]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>
                      <span id="mb_prize_4" className="prize3 div-horizontal">
                        {ketQua[3].data[0]}
                      </span>
                      <span id="mb_prize_5" className="prize3 div-horizontal">
                        {ketQua[3].data[1]}
                      </span>
                      <span id="mb_prize_6" className="prize3 div-horizontal">
                        {ketQua[3].data[2]}
                      </span>
                      <span id="mb_prize_7" className="prize3 div-horizontal">
                        {ketQua[3].data[3]}
                      </span>
                      <span id="mb_prize_8" className="prize3 div-horizontal">
                        {ketQua[3].data[4]}
                      </span>
                      <span id="mb_prize_9" className="prize3 div-horizontal">
                        {ketQua[3].data[5]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>
                      <span id="mb_prize_10" className="prize4 div-horizontal">
                        {ketQua[4].data[0]}
                      </span>
                      <span id="mb_prize_11" className="prize4 div-horizontal">
                        {ketQua[4].data[1]}
                      </span>
                      <span id="mb_prize_12" className="prize4 div-horizontal">
                        {ketQua[4].data[2]}
                      </span>
                      <span id="mb_prize_13" className="prize4 div-horizontal">
                        {ketQua[4].data[3]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>5</th>
                    <td>
                      <span id="mb_prize_14" className="prize5 div-horizontal">
                        {ketQua[5].data[0]}
                      </span>
                      <span id="mb_prize_15" className="prize5 div-horizontal">
                        {ketQua[5].data[1]}
                      </span>
                      <span id="mb_prize_16" className="prize5 div-horizontal">
                        {ketQua[5].data[2]}
                      </span>
                      <span id="mb_prize_17" className="prize5 div-horizontal">
                        {ketQua[5].data[3]}
                      </span>
                      <span id="mb_prize_18" className="prize5 div-horizontal">
                        {ketQua[5].data[4]}
                      </span>
                      <span id="mb_prize_19" className="prize5 div-horizontal">
                        {ketQua[5].data[5]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>6</th>
                    <td>
                      <span id="mb_prize_20" className="prize6 div-horizontal">
                        {ketQua[6].data[0]}
                      </span>
                      <span id="mb_prize_21" className="prize6 div-horizontal">
                        {ketQua[6].data[1]}
                      </span>
                      <span id="mb_prize_22" className="prize6 div-horizontal">
                        {ketQua[6].data[2]}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>7</th>
                    <td>
                      <span id="mb_prize_23" className="prize7 div-horizontal">
                        {ketQua[7].data[0]}
                      </span>
                      <span id="mb_prize_24" className="prize7 div-horizontal">
                        {ketQua[7].data[1]}
                      </span>
                      <span id="mb_prize_25" className="prize7 div-horizontal">
                        {ketQua[7].data[2]}
                      </span>
                      <span id="mb_prize_26" className="prize7 div-horizontal">
                        {ketQua[7].data[3]}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Thời gian: {convertDateTime(dataQuery.createdAt)}
            </Typography>
          </>
        )}
      </Box>
    </>
  );
};
export default ChiTietPhien;
