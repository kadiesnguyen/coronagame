import DepositService from "@/services/admin/DepositService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedDepositHistory = ({ id }) => {
  const getData = async () => {
    try {
      const response = await DepositService.getDetailedDepositHistory({ id });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-detailed-deposit-history", "admin", { id }], () =>
    getData()
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
export default useGetDetailedDepositHistory;
