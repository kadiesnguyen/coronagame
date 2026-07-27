import CountdownTimer from "@/components/games/xoso/mienbac/CountdownTimer";
import { TINH_TRANG_GAME } from "@/configs/game.xoso.config";
import SocketContext from "@/context/socket";
import useGetDetailedGameHistory from "@/hooks/admin/useGetDetailedGameHistory";
import { convertJSXTinhTrangGameXoSo } from "@/utils/convertTinhTrang";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

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
  const [timerOpen, setTimerOpen] = useState(0);
  const [timerStopBet, setTimerStopBet] = useState(0);
  const [phien, setPhien] = useState(dataQuery?.ngay ?? 0);
  const [ketQua, setKetQua] = useState(dataQuery?.ketQua?.length > 0 ? dataQuery.ketQua : DEFAULT_RESULT);
  const [tinhTrang, setTinhTrang] = useState(dataQuery?.tinhTrang ?? TINH_TRANG_GAME.DANG_CHO);

  useEffect(() => {
    if (dataQuery) {
      // Reset kết quả
      const { ngay, tinhTrang, ketQua, openTime } = dataQuery;
      setPhien(ngay);
      setTinhTrang(tinhTrang);
      setKetQua(ketQua.length === 0 ? DEFAULT_RESULT : ketQua);
    }
  }, [dataQuery]);

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
          setTimerOpen(data.timerOpen);
          setTimerStopBet(data.timerStopBet);
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
        }
      });

      return () => {
        socket.off(`${TYPE_GAME}:admin:refetch-data-chi-tiet-phien-game`);
        socket.off(`${TYPE_GAME}:admin:timer`);
        socket.off(`${TYPE_GAME}:admin:ketqua`);
        socket.off(`${TYPE_GAME}:admin:batDauGame`);
        socket.off(`${TYPE_GAME}:admin:batDauQuay`);
        socket.off(`${TYPE_GAME}:admin:dungQuay`);
        socket.off(`${TYPE_GAME}:admin:hoanTatGame`);
      };
    }
  }, [socket, phien]);

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
                  Thời gian trả thưởng
                </Typography>
                <CountdownTimer countdownTime={timerOpen} />
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Thời gian dừng cược
                </Typography>
                <CountdownTimer countdownTime={timerStopBet} />
              </>
            )}

            {ketQua && ketQua.length > 0 && tinhTrang !== TINH_TRANG_GAME.DANG_CHO && (
              <>
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Kết quả:
                </Typography>
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
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};
export default ChiTietPhien;
