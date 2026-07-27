import CountdownTimer from "@/components/games/xucxac/CountdownTimer";
import { TINH_TRANG_GAME } from "@/configs/game.xucxac.config";
import SocketContext from "@/context/socket";
import useGetDetailedGameHistory from "@/hooks/admin/useGetDetailedGameHistory";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangGameXucXac } from "@/utils/convertTinhTrang";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import BoxQuay from "./BoxQuay";

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
  const [ketQua, setKetQua] = useState(dataQuery?.ketQua?.length > 0 ? dataQuery.ketQua : [0, 0, 0]);
  const [ketQuaDieuChinh, setKetQuaDieuChinh] = useState([0, 0, 0]);
  const [isDieuChinh, setIsDieuChinh] = useState(false);
  const [tinhTrang, setTinhTrang] = useState(dataQuery?.tinhTrang ?? TINH_TRANG_GAME.DANG_CHO);

  useEffect(() => {
    if (dataQuery) {
      const { phien, tinhTrang, ketQua } = dataQuery;
      setPhien(phien);
      setTinhTrang(tinhTrang);
      setKetQua(ketQua.length === 0 ? [0, 0, 0] : ketQua);
      setIsDieuChinh(false);
      setKetQuaDieuChinh([0, 0, 0]);
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
          setKetQuaDieuChinh([0, 0, 0]);
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
              Tình trạng: {convertJSXTinhTrangGameXucXac(tinhTrang)}
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
              Kết quả: {tinhTrang === TINH_TRANG_GAME.DANG_CHO ? "Click vào các nút để điều chỉnh kết quả" : ""}
            </Typography>
            <BoxQuay
              TYPE_GAME={TYPE_GAME}
              tinhTrang={tinhTrang}
              ketQuaDieuChinh={ketQuaDieuChinh}
              setKetQuaDieuChinh={setKetQuaDieuChinh}
              isDieuChinh={isDieuChinh}
              setIsDieuChinh={setIsDieuChinh}
              ketQua={ketQua}
              setKetQua={setKetQua}
            />
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
