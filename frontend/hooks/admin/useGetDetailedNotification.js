import NotificationService from "@/services/admin/NotificationService";
import { useEffect } from "react";
import { useQuery } from "react-query";
const useGetDetailedNotification = ({ id }) => {
  const getData = async () => {
    try {
      const response = await NotificationService.getDetailedNotification({ id });
      const data = response.data.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading, isError, refetch } = useQuery(["get-detailed-notification", "admin", { id }], () =>
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
export default useGetDetailedNotification;
