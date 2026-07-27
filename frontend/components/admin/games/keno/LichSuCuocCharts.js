import SocketContext from "@/context/socket";
import { Box, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

import useGetDetailedBetGameHistory from "@/hooks/admin/useGetDetailedBetGameHistory";

const transformDataChart = (dataQuery) => {
  const tempDataChart = [];
  const Cuoc1C = { name: "1C", value: 0 };
  const Cuoc1L = { name: "1L", value: 0 };

  const Cuoc2C = { name: "2C", value: 0 };
  const Cuoc2L = { name: "2L", value: 0 };

  const Cuoc3C = { name: "3C", value: 0 };
  const Cuoc3L = { name: "3L", value: 0 };

  const Cuoc4C = { name: "4C", value: 0 };
  const Cuoc4L = { name: "4L", value: 0 };

  const Cuoc5C = { name: "5C", value: 0 };
  const Cuoc5L = { name: "5L", value: 0 };

  dataQuery?.map((item) => {
    item.datCuoc.map((itemCuoc) => {
      if (itemCuoc.loaiBi === 1 && itemCuoc.loaiCuoc === "C") {
        Cuoc1C.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 1 && itemCuoc.loaiCuoc === "L") {
        Cuoc1L.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 2 && itemCuoc.loaiCuoc === "C") {
        Cuoc2C.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 2 && itemCuoc.loaiCuoc === "L") {
        Cuoc2L.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 3 && itemCuoc.loaiCuoc === "C") {
        Cuoc3C.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 3 && itemCuoc.loaiCuoc === "L") {
        Cuoc3L.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 4 && itemCuoc.loaiCuoc === "C") {
        Cuoc4C.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 4 && itemCuoc.loaiCuoc === "L") {
        Cuoc4L.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 5 && itemCuoc.loaiCuoc === "C") {
        Cuoc5C.value += itemCuoc.tienCuoc;
      } else if (itemCuoc.loaiBi === 5 && itemCuoc.loaiCuoc === "L") {
        Cuoc5L.value += itemCuoc.tienCuoc;
      }
    });
  });
  tempDataChart.push(
    Cuoc1C,
    Cuoc1L,

    Cuoc2C,
    Cuoc2L,

    Cuoc3C,
    Cuoc3L,

    Cuoc4C,
    Cuoc4L,

    Cuoc5C,
    Cuoc5L
  );

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
        <h1
          className="title"
          style={{
            justifyContent: "center",
            fontSize: "2.5rem",
          }}
        >
          Thống kê tiền cược
        </h1>
        {isLoading && <CircularProgress color="inherit" />}

        {!isLoading && (
          <>
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
          </>
        )}
      </Box>
    </>
  );
};
export default LichSuCuocCharts;
