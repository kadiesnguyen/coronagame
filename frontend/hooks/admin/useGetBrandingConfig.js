import SystemService from "@/services/admin/SystemService";
import { useQuery } from "react-query";

const useGetBrandingConfig = () => {
  const { data, isLoading, refetch } = useQuery(["admin-branding"], async () => {
    const response = await SystemService.getBrandingConfig();
    return response.data.data;
  });

  return { data, isLoading, refetch };
};

export default useGetBrandingConfig;
