import UserService from "@/services/UserService";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { transformData } from "../utils/transformData";

const ITEMS_OF_PAGE = 20;

const useGetLichSuThamGia = ({ pageSize = ITEMS_OF_PAGE } = {}) => {
  const getData = async (pageParam) => {
    const response = await UserService.getLichSuThamGia({
      pageSize,
      page: pageParam,
    });
    return response.data;
  };

  const getListQuery = useInfiniteQuery(
    ["get-lich-su-tham-gia", { pageSize }],
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

  const { data, isLoading, isFetching, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } = getListQuery;

  useEffect(() => {
    if (isError) {
      throw new Error(error);
    }
  }, [isError, error]);

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

export default useGetLichSuThamGia;
