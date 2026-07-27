import WithdrawService from "@/services/admin/WithdrawService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetCountAllWithdrawHistory = ({ userId = "" }) => {
  const getData = async () => {
    try {
      const response = await WithdrawService.countAllWithdrawHistory({ userId });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };
  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-count-all-withdraw-history", "admin", { userId }],
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
export default useGetCountAllWithdrawHistory;
