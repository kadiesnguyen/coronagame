import SystemService from "@/services/admin/SystemService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetBotTelegramConfig = () => {
  const getData = async () => {
    try {
      const response = await SystemService.getBotTelegramConfig();
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-bot-telegram-config", "admin"], () => getData());
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
export default useGetBotTelegramConfig;
