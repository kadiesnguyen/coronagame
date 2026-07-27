import api from "@/configs/axios";

class UserService {
  static getDetailedInformation = async () => {
    const result = await api.get(`/v1/nguoidung`);
    return result;
  };

  static getLichSuThamGia = async ({ pageSize = 20, page = 1 } = {}) => {
    const result = await api.get(`/v1/nguoidung/lich-su-tham-gia?results=${pageSize}&page=${page}`);
    return result;
  };

  static changePassword = async ({ currentPassword, newPassword }) => {
    const result = await api.post(`/v1/nguoidung/update-password`, {
      currentPassword,
      newPassword,
    });
    return result;
  };
}
export default UserService;
