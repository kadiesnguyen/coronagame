import api from "@/configs/axios";
class BalanceFluctuationsService {
  static getListBalanceFluctuations = async ({ pageSize, page }) => {
    const res = await api.get(`/v1/biendongsodu?results=${pageSize}&page=${page}`);
    return res;
  };
}

export default BalanceFluctuationsService;
