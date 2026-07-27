const TYPE_ACTIVITY = {
  AUTH: "auth",
  GAME: "game",
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  ADMIN: "admin",
  BALANCE: "balance",
  BANK: "bank",
};

const ACTION_ACTIVITY = {
  AUTH: {
    LOGIN: "login",
    SIGN_UP: "sign_up",
    UPDATE_PASSWORD: "update_password",
    SIGN_OUT: "sign_out",
    REFRESH_TOKEN: "refresh_token",
    GET_DETAILED_USER: "get_detailed_user",
  },
  BALANCE: {
    GET_LIST_TRANSACTION: "get_list_transaction",
  },
  GAME: {
    DAT_CUOC: "dat_cuoc",
  },
  DEPOSIT: {
    CREATE_ORDER: "CREATE_ORDER",
  },
  BANK: {
    CREATE_BANK: "CREATE_BANK",
  },
  ADMIN: {
    SET_TI_LE_GAME: "set_ti_le_game",
    SET_STATUS_AUTO_GAME: "set_status_auto_game",
    SET_BOT_TELEGRAM: "set_bot_telegram",
    SET_TAWK_TO: "SET_TAWK_TO",
    ADD_BANK: "ADD_BANK",
    EDIT_BANK: "EDIT_BANK",
    REMOVE_BANK: "REMOVE_BANK",
    ADD_NOTIFICATION: "ADD_NOTIFICATION",
    EDIT_NOTIFICATION: "EDIT_NOTIFICATION",
    DELETE_NOTIFICATION: "DELETE_NOTIFICATION",
    UPDATE_MONEY: "UPDATE_MONEY",
    UPDATE_PASSWORD_USER: "UPDATE_PASSWORD_USER",
    UPDATE_INFORMATION_USER: "UPDATE_INFORMATION_USER",
  },
};
Object.freeze(TYPE_ACTIVITY);
Object.freeze(ACTION_ACTIVITY);

module.exports = {
  TYPE_ACTIVITY,
  ACTION_ACTIVITY,
};
