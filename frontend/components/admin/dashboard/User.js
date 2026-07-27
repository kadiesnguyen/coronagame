import DashboardChartCard from "@/components/admin/dashboard/DashboardChartCard";
import SocketContext from "@/context/socket";
import useGetUsersDashboard from "@/hooks/admin/useGetUsersDashboard";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";

const RESULTS_DATE_RANGE = 7;

const User = () => {
  const { socket } = useContext(SocketContext);
  const fromDate = dayjs().subtract(RESULTS_DATE_RANGE, "day");
  const toDate = dayjs();
  const { data, refetch } = useGetUsersDashboard({
    fromDate: `${fromDate.get("year")}/${fromDate.get("month") + 1}/${fromDate.get("date")}`,
    toDate: `${toDate.get("year")}/${toDate.get("month") + 1}/${toDate.get("date")}`,
  });

  useEffect(() => {
    if (!socket) return undefined;
    socket.on(`admin:refetch-data-users-dashboard`, () => {
      refetch();
    });
    return () => {
      socket.off(`admin:refetch-data-users-dashboard`);
    };
  }, [socket, refetch]);

  return (
    <DashboardChartCard
      title="Người dùng mới"
      totalLabel={`Tổng ${RESULTS_DATE_RANGE} ngày gần nhất`}
      totalValue={data?.metadata?.totalUsers ?? 0}
      data={data?.data ?? []}
      seriesName="User mới"
      accent="#3a86ff"
      accentSoft="rgba(58,134,255,.4)"
      Icon={PersonAddAlt1OutlinedIcon}
      valueFormatter={(v) => `${Number(v) || 0}`}
      yTickFormatter={(v) => `${v}`}
    />
  );
};

export default User;
