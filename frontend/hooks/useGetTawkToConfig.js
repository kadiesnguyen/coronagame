import SystemService from "@/services/SystemService";
import { useEffect } from "react";
import { useQuery } from "react-query";

const useGetTawkToConfig = ({ throwOnError = true } = {}) => {
  const getData = async () => {
    const response = await SystemService.getTawkToConfig();
    return response.data.data;
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-tawk-to-config"], getData, {
    retry: 1,
  });

  useEffect(() => {
    if (throwOnError && isError) {
      throw new Error(error);
    }
  }, [throwOnError, isError, error]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useGetTawkToConfig;
