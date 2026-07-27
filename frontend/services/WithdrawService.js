import api from "@/configs/axios";
class WithdrawService {
  static getList = async ({ pageSize, page }) => {
    const res = await api.get(`/v1/ruttien?results=${pageSize}&page=${page}`);
    return res;
  };
  static createWithdraw = async ({ soTien, nganHang }) => {
    const result = await api.post(`/v1/ruttien`, {
      soTien,
      nganHang,
    });
    return result;
  };
}
export default WithdrawService;
