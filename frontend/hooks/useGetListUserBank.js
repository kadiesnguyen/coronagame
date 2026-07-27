import ListBankService from "@/services/ListBankService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetListUserBank = () => {
  const getData = async () => {
    try {
      const response = await ListBankService.getListUserBank();
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError } = useQuery(["get-list-user-bank"], () => getData());
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
export default useGetListUserBank;
