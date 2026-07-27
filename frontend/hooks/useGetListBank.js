import SystemService from "@/services/SystemService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetListBank = () => {
  const getData = async () => {
    try {
      const response = await SystemService.getListBank();
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError } = useQuery(["get-list-bank"], () => getData());
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
