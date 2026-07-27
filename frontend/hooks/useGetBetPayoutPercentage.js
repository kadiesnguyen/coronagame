import GameService from "@/services/GameService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetBetPayoutPercentage = ({ typeGame = "keno1p", vipLevel }) => {
  const getData = async () => {
    try {
      const response = await GameService.getTiLeGame({
        typeGame,
        vipLevel,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-bet-payout-percentage", { typeGame, vipLevel }],
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
export default useGetBetPayoutPercentage;
