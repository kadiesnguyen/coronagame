import NotificationService from "@/services/NotificationService";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { transformData } from "../utils/transformData";
const ITEMS_OF_PAGE = 10;

const useGetListNotifications = ({ limitItems = ITEMS_OF_PAGE }) => {
  const getData = async (pageParam) => {
    try {
      const response = await NotificationService.getListNotifications({
        pageSize: limitItems,
        page: pageParam,
      });
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getListQuery = useInfiniteQuery(
    ["get-list-notifications", { limitItems }],
    ({ pageParam = 1 }) => getData(pageParam),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages[pages.length - 1]?.metadata?.results === limitItems) {
          return pages.length + 1;
        }
        return undefined;
      },
      select: transformData,
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
export default useGetListNotifications;
