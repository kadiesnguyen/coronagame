import BrandingService from "@/services/BrandingService";
import { DEFAULT_BANNERS, DEFAULT_LOGO_URL } from "@/utils/branding";
import { useQuery } from "react-query";

const useGetBranding = () => {
  const { data, isLoading, refetch } = useQuery(
    ["get-branding"],
    async () => {
      const response = await BrandingService.getBranding();
      return response.data.data;
    },
    {
      staleTime: 60_000,
    }
  );

  const logoUrl = data?.logoUrl || DEFAULT_LOGO_URL;
  const banners = data?.banners?.length ? data.banners : DEFAULT_BANNERS;

  return {
    data: {
      logoUrl,
      banners,
      raw: data,
    },
    isLoading,
    refetch,
  };
};

export default useGetBranding;
