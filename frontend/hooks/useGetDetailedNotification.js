import NotificationService from "@/services/NotificationService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedNotification = ({ id }) => {
  const getData = async () => {
    try {
      const response = await NotificationService.getDetailedNotification({
        id,
      });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError } = useQuery(["get-detailed-notification", { id }], () => getData());
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
export default useGetDetailedNotification;
