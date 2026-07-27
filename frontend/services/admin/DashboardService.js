import api from "@/configs/axios";
class DashboardService {
  static getUsersDashboard = async ({ fromDate, toDate }) => {
    const res = await api.get(`/v1/admin/dashboard/users?fromDate=${fromDate}&toDate=${toDate}`);
    return res;
  };
  static getDepositDashboard = async ({ fromDate, toDate }) => {
    const res = await api.get(`/v1/admin/dashboard/deposit?fromDate=${fromDate}&toDate=${toDate}`);
    return res;
  };
  static getGameTransactionalDashboard = async ({ fromDate, toDate }) => {
    const res = await api.get(`/v1/admin/dashboard/game-transactionals?fromDate=${fromDate}&toDate=${toDate}`);
    return res;
  };
}

export default DashboardService;
