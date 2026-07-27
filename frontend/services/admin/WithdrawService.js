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
  static updateWithdrawBank = async ({ id, tenNganHang, tenChuTaiKhoan, soTaiKhoan, bankCode }) => {
    const res = await api.put(`/v1/admin/rut-tien/${id}/ngan-hang`, {
      tenNganHang,
      tenChuTaiKhoan,
      soTaiKhoan,
      bankCode,
    });
    return res;
  };
  static countAllWithdrawHistory = async ({ userId, statusGroup = "" }) => {
    const res = await api.get(
      `/v1/admin/rut-tien/get-all?userId=${userId || ""}&statusGroup=${statusGroup || ""}`
    );
    return res;
  };
  static getListWithdrawHistory = async ({ pageSize, page, userId, statusGroup = "" }) => {
    const res = await api.get(
      `/v1/admin/rut-tien?results=${pageSize}&page=${page}&userId=${userId || ""}&statusGroup=${statusGroup || ""}`
    );
    return res;
  };
}
export default WithdrawService;
