import GameService from "@/services/GameService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedBetHistory = ({ typeGame = "keno1p", phien, vipLevel }) => {
  const getData = async () => {
    try {
      const response = await GameService.getDetailedUserBetGameHistory({
        typeGame,
        phien,
        vipLevel,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Redux game slices init phien=0 before socket sync — never hit /lich-su-cuoc/0
  const hasValidPhien = Number(phien) > 0;
  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-detailed-bet-history", { typeGame, phien, vipLevel }],
    () => getData(),
    { enabled: hasValidPhien, retry: false }
  );
  useEffect(() => {
    // 404 = phiên chưa tồn tại / chưa có cược — không crash cả trang game
    if (isError && error?.response?.status !== 404) {
      throw new Error(error);
    }
  }, [isError, error]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
export default useGetDetailedBetHistory;
