import BankService from "@/services/admin/BankService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedBank = ({ id }) => {
  const getData = async () => {
    try {
      const response = await BankService.getDetailedBank({ id });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-detailed-bank", "admin", { id }], () =>
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
export default useGetDetailedBank;
