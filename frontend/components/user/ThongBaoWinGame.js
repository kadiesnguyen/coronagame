import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import SocketContext from "../../context/socket";

const ThongBaoWinGame = () => {
  const { data: session, status } = useSession();
  const [dataThongBaoWinGame, setDataThongBaoWinGame] = useState({
    isActive: false,
    money: 0,
  });

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket && status === "authenticated") {
      socket.off("set-current-balance").on("set-current-balance", (data) => {
        setDataThongBaoWinGame({ isActive: true, money: data });
      });
      socket.off("update-current-balance").on("update-current-balance", (data) => {
        setDataThongBaoWinGame({ isActive: true, money: data });
      });

      return () => {
        socket.off("set-current-balance");
        socket.off("update-current-balance");
      };
    }
  }, [socket, status]);

  return (
    <>
      <ItemThongBaoWinGame setDataThongBaoWinGame={setDataThongBaoWinGame} dataThongBaoWinGame={dataThongBaoWinGame} />
    </>
  );
};

export default ThongBaoWinGame;

const ItemThongBaoWinGame = ({ dataThongBaoWinGame, setDataThongBaoWinGame }) => {
  const MONEY = dataThongBaoWinGame?.money || 0;
  const [isClose, setIsClose] = useState(!dataThongBaoWinGame.isActive);
  const timerCloseRef = useRef();

  useEffect(() => {
    if (!timerCloseRef.current) {
      timerCloseRef.current = setTimeout(() => {
        setIsClose(true);
        setDataThongBaoWinGame((prev) => ({ ...prev, isActive: false, money: 0 }));
      }, 5000);
    }
    return () => {
      clearTimeout(timerCloseRef.current);
    };
  }, []);

  useEffect(() => {
    if (isClose) {
      clearTimeout(timerCloseRef.current);
    }
  }, [isClose]);
  return (
    <>
      {!isClose && (
        <Box
          onClick={() => setIsClose(true)}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            borderRadius: "1rem",
            backgroundImage: "linear-gradient(to right, #a68787, #392d2c)",
            padding: "1rem",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 99,
          }}
        >
          <Typography
            sx={{
              color: "#e13343",
              fontWeight: "bold",
              fontSize: "2rem",
            }}
          >
            Chúc mừng bạn
          </Typography>
          <Typography
            sx={{
              color: "#e13343",
              fontWeight: "bold",
              fontSize: "2rem",
            }}
          >
            thắng
          </Typography>
          <Typography
            sx={{
              color: "#e13343",
              fontWeight: "bold",
              fontSize: "2rem",
            }}
          >
            + <NumericFormat value={MONEY} displayType="text" allowLeadingZeros thousandSeparator="," />đ
          </Typography>
        </Box>
      )}
    </>
  );
};
