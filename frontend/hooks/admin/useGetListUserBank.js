import UserService from "@/services/admin/UserService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetListUserBank = ({ userId }) => {
  const getData = async () => {
    try {
      const response = await UserService.getListUserBank({ userId });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError } = useQuery(
    [
      "get-list-user-bank",
      "admin",
      {
        userId,
      },
    ],
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
  };
};
export default useGetListUserBank;
