import GameService from "@/services/admin/GameService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetAutoGameStatus = ({ typeGame = "keno1p" }) => {
  const getData = async () => {
    try {
      const response = await GameService.getStatusAutoGame({
        typeGame,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-auto-game-status", "admin", { typeGame }], () =>
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
export default useGetAutoGameStatus;
