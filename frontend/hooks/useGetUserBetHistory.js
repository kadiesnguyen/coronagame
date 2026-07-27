import GameService from "@/services/GameService";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { transformData } from "../utils/transformData";
const ITEMS_OF_PAGE = 10;

const useGetUserBetHistory = ({ typeGame = "keno1p", pageSize = ITEMS_OF_PAGE }) => {
  const getData = async (pageParam) => {
    try {
      const response = await GameService.getUserBetHistory({
        typeGame,
        pageSize,
        page: pageParam,
      });

      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getListQuery = useInfiniteQuery(
    ["get-user-bet-history", { typeGame, pageSize }],
    ({ pageParam = 1 }) => getData(pageParam),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1]?.metadata?.results === pageSize) {
          return pages.length + 1;
        }
        return undefined;
      },
      select: transformData,
    }
  );
  const { data, isLoading, isFetching, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    getListQuery;
  useEffect(() => {
    if (isError) {
      throw new Error(error);
    }
  }, [isError]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
};
export default useGetUserBetHistory;
