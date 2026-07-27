import api from "@/configs/axios";

class UserService {
  static getListUsers = async ({ pageSize, page, searchValue }) => {
    const result = await api.get(`/v1/admin/users?results=${pageSize}&page=${page}&query=${searchValue}`);
    return result;
  };
  static getListAdmins = async ({ searchValue = "" } = {}) => {
    const result = await api.get(`/v1/admin/users/admins?query=${encodeURIComponent(searchValue)}`);
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
  static updateUserBank = async ({ id, tenNganHang, tenChuTaiKhoan, soTaiKhoan, bankCode }) => {
    const result = await api.put(`/v1/admin/users/list-bank/${id}`, {
      tenNganHang,
      tenChuTaiKhoan,
      soTaiKhoan,
      bankCode,
    });
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
  static updateMoneyUser = async ({ userId, moneyUpdate, noiDung }) => {
    const res = await api.post(`/v1/admin/users/update-money`, {
      userId,
      moneyUpdate,
      ...(noiDung ? { noiDung } : {}),
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
  static deleteUsers = async ({ userIds }) => {
    const res = await api.post(`/v1/admin/users/delete`, { userIds });
    return res;
  };
}
export default UserService;
