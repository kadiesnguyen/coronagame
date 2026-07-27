import BalanceFluctuationsService from "@/services/BalanceFluctuationsService";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { transformData } from "../utils/transformData";
const ITEMS_OF_PAGE = 30;

const useGetBalanceFluctuations = ({ pageSize = ITEMS_OF_PAGE }) => {
  const getData = async (pageParam) => {
    try {
      const response = await BalanceFluctuationsService.getListBalanceFluctuations({
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
    [
      "get-balance-fluctuations",
      {
        pageSize,
      },
    ],
    ({ pageParam = 1 }) => getData(pageParam),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1]?.metadata?.results === pageSize) {
          return pages.length + 1;
        }
        return undefined;
      },
      select: transformData,
      refetchOnWindowFocus: true,
    }
  );
  const { data, isLoading, isFetching, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = getListQuery;
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
  };
};
export default useGetBalanceFluctuations;
