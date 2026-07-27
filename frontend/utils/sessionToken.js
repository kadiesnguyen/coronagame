/** Cache accessToken cho axios (tránh getSession() rỗng → 401 lúc đặt cược). */
let accessToken = null;

export const setSessionAccessToken = (token) => {
  accessToken = typeof token === "string" && token ? token : null;
};

export const getSessionAccessToken = () => accessToken;
