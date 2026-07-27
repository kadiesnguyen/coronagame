import UserService from "@/services/admin/UserService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetCountAllActivitiesUser = ({ userId }) => {
  const getData = async () => {
    try {
      const response = await UserService.getCountAllActivitiesUser({ userId });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["get-count-all-activities-user", "admin", { userId }],
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
export default useGetCountAllActivitiesUser;
