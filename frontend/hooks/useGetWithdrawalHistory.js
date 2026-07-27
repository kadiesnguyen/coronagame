import axios from "axios";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { transformData } from "../utils/transformData";
const ITEMS_OF_PAGE = 10;

const useGetWithdrawalHistory = () => {
  const getData = async (pageParam) => {
    try {
      const response = await axios.get(
        `${process.env.ENDPOINT_SERVER}/api/v1/lichsurut?results=${ITEMS_OF_PAGE}&page=${pageParam}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getListQuery = useInfiniteQuery(["get-withdrawal-history"], ({ pageParam = 1 }) => getData(pageParam), {
    getNextPageParam: (_lastPage, pages) => {
      if (pages[pages.length - 1].results === ITEMS_OF_PAGE) {
        return pages.length + 1;
      }
      return undefined;
    },
    select: transformData,
  });
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
export default useGetWithdrawalHistory;
