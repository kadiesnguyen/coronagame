import api from "@/configs/axios";
class NotificationService {
  static getDetailedNotification = async ({ id }) => {
    const res = await api.get(`/v1/admin/thong-bao/${id}`);
    return res;
  };
  static countAllNotification = async () => {
    const res = await api.get(`/v1/admin/thong-bao/get-all`);
    return res;
  };
  static getListNotifications = async ({ pageSize, page }) => {
    const res = await api.get(`/v1/admin/thong-bao?results=${pageSize}&page=${page}`);
    return res;
  };
  static editNotification = async ({ id, tieuDe, hinhAnh, noiDung }) => {
    const res = await api.put(`/v1/admin/thong-bao/${id}`, {
      tieuDe,
      hinhAnh,
      noiDung,
    });
    return res;
  };
  static createNotification = async ({ tieuDe, hinhAnh, noiDung }) => {
    const res = await api.post(`/v1/admin/thong-bao`, {
      tieuDe,
      hinhAnh,
      noiDung,
    });
    return res;
  };
  static deleteNotification = async ({ id }) => {
    const res = await api.delete(`/v1/admin/thong-bao/${id}`);
    return res;
  };
}

export default NotificationService;
