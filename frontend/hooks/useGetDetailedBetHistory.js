import GameService from "@/services/GameService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedBetHistory = ({ typeGame = "keno1p", phien }) => {
  const getData = async () => {
    try {
      const response = await GameService.getDetailedUserBetGameHistory({
        typeGame,
        phien,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-detailed-bet-history", { typeGame, phien }], () =>
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
export default useGetDetailedBetHistory;
