import SystemService from "@/services/admin/SystemService";
import { useQuery } from "react-query";

const useGetVipLevelsConfig = () => {
  const { data, isLoading, refetch } = useQuery(["admin-vip-levels"], async () => {
    const response = await SystemService.getVipLevelsConfig();
    return response.data.data;
  });

  return { data, isLoading, refetch };
};

export default useGetVipLevelsConfig;
