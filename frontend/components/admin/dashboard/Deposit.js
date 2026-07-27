import DashboardChartCard from "@/components/admin/dashboard/DashboardChartCard";
import SocketContext from "@/context/socket";
import useGetDepositDashboard from "@/hooks/admin/useGetDepositDashboard";
import { formatCompactMoney } from "@/utils/convertMoney";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";

const RESULTS_DATE_RANGE = 7;

const Deposit = () => {
  const { socket } = useContext(SocketContext);
  const fromDate = dayjs().subtract(RESULTS_DATE_RANGE, "day");
  const toDate = dayjs();
  const { data, refetch } = useGetDepositDashboard({
    fromDate: `${fromDate.get("year")}/${fromDate.get("month") + 1}/${fromDate.get("date")}`,
    toDate: `${toDate.get("year")}/${toDate.get("month") + 1}/${toDate.get("date")}`,
  });

  useEffect(() => {
    if (!socket) return undefined;
    socket.on(`admin:refetch-data-deposit-dashboard`, () => {
      refetch();
    });
    return () => {
      socket.off(`admin:refetch-data-deposit-dashboard`);
    };
  }, [socket, refetch]);

  return (
    <DashboardChartCard
      title="Nạp tiền"
      totalLabel={`Tổng nạp ${RESULTS_DATE_RANGE} ngày (đã duyệt)`}
      totalValue={formatCompactMoney(data?.metadata?.total)}
      data={data?.data ?? []}
      seriesName="Tổng nạp"
      accent="#d4af37"
      accentSoft="rgba(212,175,55,.4)"
      Icon={AccountBalanceWalletOutlinedIcon}
      valueFormatter={formatCompactMoney}
      yTickFormatter={formatCompactMoney}
    />
  );
};

export default Deposit;
