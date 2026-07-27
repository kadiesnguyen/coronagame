import VipService from "@/services/VipService";
import { useQuery } from "react-query";

const useGetVipLevels = () => {
  const { data, isLoading, refetch } = useQuery(["get-vip-levels"], async () => {
    const response = await VipService.getVipLevels();
    return response.data.data;
  });

  return {
    data,
    isLoading,
    refetch,
  };
};

export default useGetVipLevels;
