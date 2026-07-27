import WithdrawService from "@/services/admin/WithdrawService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedWithdrawHistory = ({ id }) => {
  const getData = async () => {
    try {
      const response = await WithdrawService.getDetailedWithdrawHistory({ id });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };
  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-detailed-withdraw-history", "admin", { id }],
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
export default useGetDetailedWithdrawHistory;
