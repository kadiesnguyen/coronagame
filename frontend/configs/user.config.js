export const TINH_TRANG_USER = {
  TRUE: true,
  FALSE: false,
};
export const ROLE_USER = {
  USER: "user",
  ADMIN: "admin",
};

export const MIN_LENGTH_PASSWORD = 6;
export const MIN_LENGTH_ACCOUNT = 6;
export const convertRole = (role) => {
  switch (role) {
    case ROLE_USER.USER:
      return "Người dùng";

    case ROLE_USER.ADMIN:
      return "Quản trị";

    default:
      return "";
  }
};

export const ADMIN_LIST_USER_PAGE_SIZE = 10;
export const ADMIN_USER_BALANCE_FLUCTUATIONS_PAGE_SIZE = 10;
export const ADMIN_USER_ACTIVITIES_PAGE_SIZE = 100;
