import UserService from "@/services/admin/UserService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedUser = ({ id }) => {
  const getData = async () => {
    try {
      const response = await UserService.getDetailedUser({ id });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-detailed-user", "admin", { id }], () =>
    getData()
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
export default useGetDetailedUser;
