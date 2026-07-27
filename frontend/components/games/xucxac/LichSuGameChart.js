import Modal from "@/components/homePage/Modal";
import SocketContext from "@/context/socket";
import useGetGameHistory from "@/hooks/useGetGameHistory";
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
    XX1: item.ketQua[0],
    XX2: item.ketQua[1],
    XX3: item.ketQua[2],
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
            <YAxis type="number" domain={[1, 6]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" name="xúc xắc 1" dataKey="XX1" stroke="#ff0000" />
            <Line type="monotone" name="xúc xắc 2" dataKey="XX2" stroke="#ffae00" />
            <Line type="monotone" name="xúc xắc 3" dataKey="XX3" stroke="#00bbff" />
          </LineChart>
        </ResponsiveContainer>
      </Modal>
    </>
  );
};
export default memo(LichSuGameChart);
