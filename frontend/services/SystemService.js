import api from "@/configs/axios";
class SystemService {
  static getTawkToConfig = async () => {
    const res = await api.get(`/v1/hethong/tawk-to`);
    return res;
  };
  static getListBank = async () => {
    const res = await api.get(`/v1/hethong/ngan-hang`);
    return res;
  };
}

export default SystemService;
