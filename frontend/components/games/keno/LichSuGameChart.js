import Modal from "@/components/homePage/Modal";
import SocketContext from "@/context/socket";
import useGetGameHistory from "@/hooks/useGetGameHistory";
import { Typography } from "@mui/material";
import _ from "lodash";
import { memo, useContext, useEffect } from "react";
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
const GAME_HISTORY_PAGE_SIZE = 7;
const LichSuGameChart = ({ isModal, setIsModal, TYPE_GAME }) => {
  const { socket } = useContext(SocketContext);
  const {
    data: listLichSuGame,

    refetch,
  } = useGetGameHistory({ typeGame: TYPE_GAME, pageSize: GAME_HISTORY_PAGE_SIZE });

  const listLichSu = listLichSuGame?.sort((a, b) => a.phien - b.phien) ?? [];

  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room`);
      socket.on(`${TYPE_GAME}:ketQuaPhienHienTai`, (data) => {
        refetch();
      });
    }
  }, [socket, isModal]);

  const data = listLichSu.map((item) => ({
    name: `Phiên ${item.phien}`,
    BI1: item.ketQua[0],
    BI2: item.ketQua[1],
    BI3: item.ketQua[2],
    BI4: item.ketQua[3],
    BI5: item.ketQua[4],
  }));

  return (
    <>
      <Modal isModal={isModal} setIsModal={setIsModal} title={"Biểu đồ lịch sử game"}>
        <ResponsiveContainer width={"100%"} height={250}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 9]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" name="bi 1" dataKey="BI1" stroke="#ff0000" />
            <Line type="monotone" name="bi 2" dataKey="BI2" stroke="#ffae00" />
            <Line type="monotone" name="bi 3" dataKey="BI3" stroke="#00bbff" />
            <Line type="monotone" name="bi 4" dataKey="BI4" stroke="#c900ff" />
            <Line type="monotone" name="bi 5" dataKey="BI5" stroke="#ff6700" />
          </LineChart>
        </ResponsiveContainer>
      </Modal>
    </>
  );
};
export default memo(LichSuGameChart);
