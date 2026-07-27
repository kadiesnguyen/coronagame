import UserService from "@/services/UserService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetInformationUser = () => {
  const getData = async () => {
    try {
      const response = await UserService.getDetailedInformation();
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError } = useQuery(["get-detail-user"], () => getData());
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
export default useGetInformationUser;
