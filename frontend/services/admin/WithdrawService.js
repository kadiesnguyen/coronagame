import api from "@/configs/axios";
class WithdrawService {
  static getDetailedWithdrawHistory = async ({ id }) => {
    const res = await api.get(`/v1/admin/rut-tien/${id}`);
    return res;
  };
  static editDetailedWithdrawHistory = async ({ id, noiDung, tinhTrang }) => {
    const res = await api.put(`/v1/admin/rut-tien/${id}`, {
      noiDung,
      tinhTrang,
    });
    return res;
  };
  static countAllWithdrawHistory = async ({ userId }) => {
    const res = await api.get(`/v1/admin/rut-tien/get-all?userId=${userId}`);
    return res;
  };
  static getListWithdrawHistory = async ({ pageSize, page, userId }) => {
    const res = await api.get(`/v1/admin/rut-tien?results=${pageSize}&page=${page}&userId=${userId}`);
    return res;
  };
}
export default WithdrawService;
