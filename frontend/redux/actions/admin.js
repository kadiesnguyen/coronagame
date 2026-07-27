import { SET_LIST_USERS_SOCKET } from "./constants";
export const setListUsersSocket = (value) => (dispatch) => {
  dispatch({
    type: SET_LIST_USERS_SOCKET,
    data: value,
  });
};
