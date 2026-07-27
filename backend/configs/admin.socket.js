const KEYS_SOCKET_ADMIN = {
  JOIN_ROOM_ADMIN: "join-room-admin",
  LIST_USERS_ONLINE: "admin:list-users-online",
  GAME_ROOM_COUNTS: "admin:game-room-counts",
  GET_GAME_ROOM_COUNTS: "admin:get-game-room-counts",
  GAME_BET_ALERTS: "admin:game-bet-alerts",
  GET_GAME_BET_ALERTS: "admin:get-game-bet-alerts",
  NEW_REQUEST: "admin:new-request",
};

Object.freeze(KEYS_SOCKET_ADMIN);

const GAME_PLAYER_ROOMS = [
  "keno1p",
  "keno3p",
  "keno5p",
  "keno10p",
  "xucxac1p",
  "xucxac3p",
  "xucxac5p",
  "xucxac10p",
  "xocdia1p",
  "xoso3p",
  "xoso5p",
  "xosomb",
];

Object.freeze(GAME_PLAYER_ROOMS);

module.exports = {
  KEYS_SOCKET_ADMIN,
  GAME_PLAYER_ROOMS,
};
