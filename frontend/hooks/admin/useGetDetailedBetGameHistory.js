import GameService from "@/services/admin/GameService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedBetGameHistory = ({ typeGame = "keno1p", id }) => {
  const getData = async () => {
    try {
      const response = await GameService.getDetailedBetGameHistory({
        typeGame,
        id,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-detailed-bet-game-history", "admin", { typeGame, id }],
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
export default useGetDetailedBetGameHistory;
