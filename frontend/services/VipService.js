import api from "@/configs/axios";

class VipService {
  static getVipLevels = async () => {
    const res = await api.get("/v1/vip/levels");
    return res;
  };
}

export default VipService;
