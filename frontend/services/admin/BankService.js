import api from "@/configs/axios";
class BankService {
  static getListBank = async () => {
    const res = await api.get(`/v1/admin/ngan-hang`);
    return res;
  };
  static getDetailedBank = async ({ id }) => {
    const res = await api.get(`/v1/admin/ngan-hang/${id}`);
    return res;
  };
  static updateDetailedBank = async ({ id, data }) => {
    const res = await api.put(`/v1/admin/ngan-hang/${id}`, data);
    return res;
  };
  static deleteBank = async ({ id }) => {
    const res = await api.delete(`/v1/admin/ngan-hang/${id}`);
    return res;
  };
  static createBank = async ({ data }) => {
    const res = await api.post(`/v1/admin/ngan-hang`, data);
    return res;
  };
}

export default BankService;
