import DashboardService from "@/services/admin/DashboardService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDepositDashboard = ({ fromDate, toDate }) => {
  const getData = async () => {
    try {
      const response = await DashboardService.getDepositDashboard({
        fromDate,
        toDate,
      });
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-deposit-dashboard", "admin", { fromDate, toDate }],
    () => getData()
  );
  useEffect(() => {
    if (isError) {
      throw new Error(error);
    }
  }, [isError]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
export default useGetDepositDashboard;
