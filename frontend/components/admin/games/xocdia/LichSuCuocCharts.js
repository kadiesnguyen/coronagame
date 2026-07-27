import SocketContext from "@/context/socket";
import { Box, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

import { CHI_TIET_CUOC_GAME, convertChiTietCuoc } from "@/configs/game.xocdia.config";
import useGetDetailedBetGameHistory from "@/hooks/admin/useGetDetailedBetGameHistory";

const transformDataChart = (dataQuery) => {
  const tempDataChart = Object.values(CHI_TIET_CUOC_GAME).map((item) => {
    return {
      key: item,
      name: convertChiTietCuoc(item),
      value: 0,
    };
  });
  dataQuery?.map((item) => {
    item.datCuoc.map((itemCuoc) => {
      const findItemCuoc = tempDataChart.find((itemDataChart) => itemDataChart.key === itemCuoc.chiTietCuoc);
      if (findItemCuoc) {
        findItemCuoc.value += itemCuoc.tienCuoc;
      }
    });
  });

  return tempDataChart;
};
const LichSuCuocCharts = ({ ID, TYPE_GAME }) => {
  const { socket } = useContext(SocketContext);
  const {
    data: dataQuery,
    isLoading,
    refetch,
  } = useGetDetailedBetGameHistory({
    typeGame: TYPE_GAME,
    id: ID,
  });
  const [dataChart, setDataChart] = useState(transformDataChart(dataQuery));

  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room-admin`);
      socket.on(`${TYPE_GAME}:admin:refetch-data-lich-su-cuoc-game`, ({ phien }) => {
        if (phien == ID) {
          refetch();
        }
      });
      return () => {
        socket.off(`${TYPE_GAME}:admin:refetch-data-lich-su-cuoc-game`);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (dataQuery) {
      setDataChart(transformDataChart(dataQuery));
    }
  }, [dataQuery]);

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",

          width: "100%",
        }}
      >
        <h2
          className="title"
          style={{
            justifyContent: "center",
            fontSize: "2.5rem",
          }}
        >
          Thống kê tiền cược
        </h2>
        {isLoading && <CircularProgress color="inherit" />}
        {!isLoading && (
          <BarChart
            style={{
              fontSize: "1.5rem",
              maxWidth: "900px",
              width: "100%",
              overflow: "auto",
              margin: "0 auto",
            }}
            width={900}
            height={500}
            data={dataChart}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
          </BarChart>
        )}
      </Box>
    </>
  );
};
export default LichSuCuocCharts;
