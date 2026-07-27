import UserService from "@/services/admin/UserService";
import { useQuery } from "react-query";

const useGetListAdmins = ({ searchValue = "" } = {}) => {
  const { data, error, isLoading, isError, refetch, isFetching } = useQuery(
    ["get-list-admins", { searchValue }],
    async () => {
      const response = await UserService.getListAdmins({ searchValue });
      return response.data?.data ?? [];
    },
    { retry: false }
  );

  return {
    data: data ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

export default useGetListAdmins;
