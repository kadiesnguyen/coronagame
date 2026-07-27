import { MARK_GAME_BET_SEEN, SET_GAME_BET_ALERTS, SET_GAME_ROOM_COUNTS, SET_LIST_USERS_SOCKET } from "./constants";

export const setListUsersSocket = (data) => ({
  type: SET_LIST_USERS_SOCKET,
  data,
});

export const setGameRoomCounts = (data) => ({
  type: SET_GAME_ROOM_COUNTS,
  data,
});

export const setGameBetAlerts = (data) => ({
  type: SET_GAME_BET_ALERTS,
  data,
});

export const markGameBetSeen = (room) => ({
  type: MARK_GAME_BET_SEEN,
  room,
});
