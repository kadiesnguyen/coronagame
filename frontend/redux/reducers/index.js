import { combineReducers } from "redux";
import balanceReducer from "./balance";
import gameKeno1PReducer from "./gameKeno1P";
import gameKeno3PReducer from "./gameKeno3P";
import gameKeno5PReducer from "./gameKeno5P";
import gameXoSo3PReducer from "./gameXoSo3P";
import gameXoSo5PReducer from "./gameXoSo5P";
import gameXoSoMBReducer from "./gameXoSoMB";
import gameXocDia1PReducer from "./gameXocDia1P";
import gameXucXac1PReducer from "./gameXucXac1P";
import gameXucXac3PReducer from "./gameXucXac3P";
import adminReducer from "./admin";

const reducers = combineReducers({
  balance: balanceReducer,
  gameKeno1P: gameKeno1PReducer,
  gameKeno3P: gameKeno3PReducer,
  gameKeno5P: gameKeno5PReducer,
  gameXucXac1P: gameXucXac1PReducer,
  gameXucXac3P: gameXucXac3PReducer,
  gameXocDia1P: gameXocDia1PReducer,
  gameXoSo3P: gameXoSo3PReducer,
  gameXoSo5P: gameXoSo5PReducer,
  gameXoSoMB: gameXoSoMBReducer,
  admin: adminReducer,
});

export default (state, action) => reducers(state, action);
