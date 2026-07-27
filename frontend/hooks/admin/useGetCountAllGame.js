import GameService from "@/services/admin/GameService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetCountAllGame = ({ typeGame = "keno1p", searchValue = "" }) => {
  const getData = async () => {
    try {
      const response = await GameService.getCountAllGame({
        typeGame,
        searchValue,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-count-all-game", "admin", { typeGame, searchValue }],
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
export default useGetCountAllGame;
