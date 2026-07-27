import DashboardChartCard from "@/components/admin/dashboard/DashboardChartCard";
import SocketContext from "@/context/socket";
import useGetGameTransactionalsDashboard from "@/hooks/admin/useGetGameTransactionalsDashboard";
import { formatCompactMoney } from "@/utils/convertMoney";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";

const RESULTS_DATE_RANGE = 7;

const GameTransactional = () => {
  const { socket } = useContext(SocketContext);
  const fromDate = dayjs().subtract(RESULTS_DATE_RANGE, "day");
  const toDate = dayjs();
  const { data, refetch } = useGetGameTransactionalsDashboard({
    fromDate: `${fromDate.get("year")}/${fromDate.get("month") + 1}/${fromDate.get("date")}`,
    toDate: `${toDate.get("year")}/${toDate.get("month") + 1}/${toDate.get("date")}`,
  });

  useEffect(() => {
    if (!socket) return undefined;
    socket.on(`admin:refetch-data-game-transactionals-dashboard`, () => {
      refetch();
    });
    return () => {
      socket.off(`admin:refetch-data-game-transactionals-dashboard`);
    };
  }, [socket, refetch]);

  return (
    <DashboardChartCard
      title="Giao dịch game"
      totalLabel={`Tổng biến động game ${RESULTS_DATE_RANGE} ngày`}
      totalValue={formatCompactMoney(data?.metadata?.total)}
      data={data?.data ?? []}
      seriesName="Giao dịch game"
      accent="#1fc67c"
      accentSoft="rgba(31,198,124,.4)"
      Icon={SportsEsportsOutlinedIcon}
      valueFormatter={formatCompactMoney}
      yTickFormatter={formatCompactMoney}
    />
  );
};

export default GameTransactional;
