import WithdrawService from "@/services/admin/WithdrawService";
import { transformData } from "@/utils/transformData";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
const ITEMS_OF_PAGE = 10;
const useGetListWithdrawHistory = ({ page = 1, pageSize = ITEMS_OF_PAGE, userId = "" }) => {
  const getData = async (pageParam) => {
    try {
      const response = await WithdrawService.getListWithdrawHistory({
        pageSize,
        page: pageParam,
        userId,
      });
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };
  const getListQuery = useInfiniteQuery(
    ["get-list-withdraw-history", "admin", { page, pageSize, userId }],
    ({ pageParam = page }) => getData(pageParam),
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
export default useGetListWithdrawHistory;
