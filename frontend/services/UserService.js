import api from "@/configs/axios";

class UserService {
  static getDetailedInformation = async () => {
    const result = await api.get(`/v1/nguoidung`);
    return result;
  };
}
export default UserService;
