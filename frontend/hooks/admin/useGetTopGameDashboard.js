import DashboardService from "@/services/admin/DashboardService";
import { useQuery } from "react-query";

const useGetTopGameDashboard = ({ days = 7 } = {}) => {
  const { data, error, isLoading, isError, refetch, isFetching } = useQuery(
    ["get-top-game-dashboard", "admin", { days }],
    async () => {
      const response = await DashboardService.getTopGameDashboard({ days });
      return response.data?.data ?? { topThang: [], topCuoc: [] };
    },
    { retry: false }
  );

  return {
    data: data ?? { topThang: [], topCuoc: [] },
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

export default useGetTopGameDashboard;
