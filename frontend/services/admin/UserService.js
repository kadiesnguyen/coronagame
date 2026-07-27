import api from "@/configs/axios";

class UserService {
  static getListUsers = async ({ pageSize, page, searchValue }) => {
    const result = await api.get(`/v1/admin/users?results=${pageSize}&page=${page}&query=${searchValue}`);
    return result;
  };
  static getDepositHistoryUser = async ({ pageSize, page, userId }) => {
    const result = await api.get(`/v1/admin/users/deposit-history?results=${pageSize}&page=${page}&userId=${userId}`);
    return result;
  };
  static getCountAllDepositHistoryUser = async ({ userId }) => {
    const res = await api.get(`/v1/admin/users/deposit-history/get-all?userId=${userId}`);
    return res;
  };
  static getBalanceFluctuationsUser = async ({ pageSize, page, userId }) => {
    const result = await api.get(`/v1/admin/users/bien-dong-so-du?results=${pageSize}&page=${page}&userId=${userId}`);
    return result;
  };

  static getCountAllBalanceFluctuationsUser = async ({ userId }) => {
    const res = await api.get(`/v1/admin/users/bien-dong-so-du/get-all?userId=${userId}`);
    return res;
  };
  static getListActivitiesUser = async ({ pageSize, page, userId }) => {
    const result = await api.get(`/v1/admin/users/nhat-ky-hoat-dong?results=${pageSize}&page=${page}&userId=${userId}`);
    return result;
  };
  static getCountAllActivitiesUser = async ({ userId }) => {
    const res = await api.get(`/v1/admin/users/nhat-ky-hoat-dong/get-all?userId=${userId}`);
    return res;
  };

  static getListUserBank = async ({ userId }) => {
    const result = await api.get(`/v1/admin/users/list-bank?userId=${userId}`);
    return result;
  };
  static getCountAllUser = async ({ searchValue }) => {
    const res = await api.get(`/v1/admin/users/get-so-luong-user?query=${searchValue}`);
    return res;
  };
  static getDetailedUser = async ({ id }) => {
    const res = await api.get(`/v1/admin/users/${id}`);
    return res;
  };
  static updateMoneyUser = async ({ userId, moneyUpdate }) => {
    const res = await api.post(`/v1/admin/users/update-money`, {
      userId,
      moneyUpdate,
    });
    return res;
  };
  static updatePasswordUser = async ({ userId, newPassword }) => {
    const res = await api.post(`/v1/admin/users/update-password`, {
      userId,
      newPassword,
    });
    return res;
  };
  static updateInformationUser = async ({ userId, role, status }) => {
    const res = await api.post(`/v1/admin/users/update-information`, {
      userId,
      role,
      status,
    });
    return res;
  };
}
export default UserService;
