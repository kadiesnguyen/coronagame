import { SET_LIST_USERS_SOCKET } from "../actions/constants";
const initialState = {
  LIST_USERS_SOCKET: [],
};
const adminReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case SET_LIST_USERS_SOCKET:
      return {
        ...state,
        LIST_USERS_SOCKET: payload.data,
      };
    default:
      return state;
  }
};
export default adminReducer;
