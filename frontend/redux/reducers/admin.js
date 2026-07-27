import { MARK_GAME_BET_SEEN, SET_GAME_BET_ALERTS, SET_GAME_ROOM_COUNTS, SET_LIST_USERS_SOCKET } from "../actions/constants";

const initialState = {
  LIST_USERS_SOCKET: [],
  GAME_ROOM_COUNTS: {},
  GAME_BET_ALERTS: {},
  GAME_BET_SEEN: {},
};

const adminReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case SET_LIST_USERS_SOCKET:
      return {
        ...state,
        LIST_USERS_SOCKET: payload.data,
      };
    case SET_GAME_ROOM_COUNTS:
      return {
        ...state,
        GAME_ROOM_COUNTS: payload.data || {},
      };
    case SET_GAME_BET_ALERTS:
      return {
        ...state,
        GAME_BET_ALERTS: payload.data || {},
      };
    case MARK_GAME_BET_SEEN: {
      const room = payload.room;
      if (!room) return state;
      const alert = state.GAME_BET_ALERTS?.[room];
      if (!alert || !alert.count) {
        return {
          ...state,
          GAME_BET_SEEN: {
            ...state.GAME_BET_SEEN,
            [room]: { phien: alert?.phien ?? "", count: 0 },
          },
        };
      }
      return {
        ...state,
        GAME_BET_SEEN: {
          ...state.GAME_BET_SEEN,
          [room]: { phien: String(alert.phien), count: Number(alert.count) || 0 },
        },
      };
    }
    default:
      return state;
  }
};

export default adminReducer;
