import api from "@/configs/axios";
class NotificationService {
  static getDetailedNotification = async ({ id }) => {
    const res = await api.get(`/v1/thongbao/${id}`);
    return res;
  };
  static getListNotifications = async ({ pageSize, page }) => {
    const res = await api.get(`/v1/thongbao?results=${pageSize}&page=${page}`);
    return res;
  };
}

export default NotificationService;
