import api from "@/configs/axios";

class BrandingService {
  static getBranding = async () => {
    const res = await api.get("/v1/hethong/branding");
    return res;
  };
}

export default BrandingService;
