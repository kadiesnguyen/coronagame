import SocketContext from "@/context/socket";
import useGetGameHistory from "@/hooks/useGetGameHistory";
import { Box, Button, Typography } from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";
import BangKetQua from "../BangKetQua";
import BangLichSuCuoc from "../BangLichSuCuoc";
import BoxQuay from "../BoxQuay";
import CountdownTimer from "./CountdownTimer";

const BoxInfor = ({ TYPE_GAME, currentDate, latestCompleteDate, tinhTrang, ketQuaRandom, timerOpen, timerStopBet }) => {
  const [isModalKetQua, setIsModalKetQua] = useState(false);
  const [isModalLichSuCuoc, setIsModalLichSuCuoc] = useState(false);
  const {
    data: listKetQua,
    isLoading,
    refetch,
  } = useGetGameHistory({
    typeGame: TYPE_GAME,
    pageSize: 1,
  });
  const phienHoanTatMoiNhat = listKetQua?.[0] ?? {};

  const { socket } = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room`);
      socket.on(`${TYPE_GAME}:dungQuay`, () => {
        refetch();
      });
      return () => {
        socket.off(`${TYPE_GAME}:dungQuay`);
      };
    }
  }, [socket]);

  return (
    <>
      <BangKetQua isModal={isModalKetQua} setIsModal={setIsModalKetQua} phienHoanTatMoiNhat={phienHoanTatMoiNhat} />
      <BangLichSuCuoc TYPE_GAME={TYPE_GAME} isModal={isModalLichSuCuoc} setIsModal={setIsModalLichSuCuoc} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1, minmax(0, 1fr))", md: "repeat(2, minmax(0, 1fr))" },
          gap: "10px",
        }}
      >
        <Box
          sx={{
            marginRight: "-0.6rem",
            borderRight: { md: "1px solid #eee" },
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Typography
              sx={{
                color: "#b7b7b7",
                fontSize: "1.5rem",
              }}
            >
              Phiên ngày
            </Typography>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {currentDate}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#477bff",
            }}
          >
            Trả kết quả lúc 18:40
          </Typography>
          <Button
            onClick={() => setIsModalLichSuCuoc(true)}
            sx={{
              border: "1px solid rgb(71, 123, 255)",
              color: "rgb(71, 123, 255)",
              background: "unset",
              fontSize: "1.4rem",
            }}
          >
            Lịch sử của bạn
          </Button>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              gap: "0.5rem",
              padding: "0px 20px",
            }}
          >
            <Typography
              sx={{
                color: "#b7b7b7",
                fontSize: "1.5rem",
              }}
            >
              Kết quả ngày
            </Typography>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {latestCompleteDate}
            </Typography>
          </Box>

          <BoxQuay tinhTrang={tinhTrang} ketQuaRandom={ketQuaRandom} phienHoanTatMoiNhat={phienHoanTatMoiNhat} />

          <Button
            sx={{
              border: "1px solid rgb(0, 185, 119)",
              color: "rgb(0, 185, 119)",
              background: "unset",
              fontSize: "1.4rem",
            }}
            onClick={() => setIsModalKetQua(true)}
          >
            Chi tiết kết quả
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 1,
          background: "#f94b55 url(/assets/images/bannertimeout.webp) no-repeat 50%",
          backgroundSize: "auto 100%",
          borderRadius: "1rem",
          display: "flex",

          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
          }}
        >
          <Typography
            sx={{
              color: "text.primary",
            }}
          >
            Mở thưởng sau
          </Typography>
          <CountdownTimer countdownTime={timerOpen} />
        </Box>
        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
            position: "relative",
            borderLeft: ".02667rem dashed #fff",
            "&::before": {
              backgroundColor: "#f5f5f5",
              borderRadius: "1rem",
              content: '""',
              height: ".4rem",
              left: "0",
              position: "absolute",
              width: ".4rem",
              bottom: "0",
              WebkitTransform: "translate(-50%, 60%)",
              transform: "translate(-50%, 60%)",
            },
            "&::after": {
              backgroundColor: "#f5f5f5",
              borderRadius: ".4rem",
              content: '""',
              height: ".4rem",
              left: "0",
              position: "absolute",
              width: ".4rem",
              top: "0",
              WebkitTransform: "translate(-50%, -60%)",
              transform: "translate(-50%, -60%)",
            },
          }}
        >
          <Typography
            sx={{
              color: "text.primary",
            }}
          >
            Ngưng nhận cược sau
          </Typography>
          <CountdownTimer countdownTime={timerStopBet} />
        </Box>
      </Box>
    </>
  );
};
export default memo(BoxInfor);
