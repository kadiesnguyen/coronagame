import BankService from "@/services/admin/BankService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetListBank = () => {
  const getData = async () => {
    try {
      const response = await BankService.getListBank();
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError } = useQuery(["get-list-bank", "admin"], () => getData());
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
  };
};
export default useGetListBank;
