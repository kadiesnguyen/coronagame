import { TINH_TRANG_GAME } from "../../configs/game.xoso.config";
import {
  SET_IS_PLAY_GAME_XOSO_MB,
  SET_KET_QUA_PHIEN_TRUOC_XOSO_MB,
  SET_KET_QUA_XOSO_MB,
  SET_PHIEN_XOSO_MB,
  SET_TIMER_XOSO_MB,
  SET_TINH_TRANG_XOSO_MB,
} from "../actions/constants";
const initialState = {
  isPlayGame: true,
  currentDate: null,
  latestCompleteDate: null,
  timer: 300,
  timerOpen: 0,
  timerStopBet: 0,
  ketQua: null,
  phienHoanTatMoiNhat: {},
  tinhTrang: TINH_TRANG_GAME.DANG_CHO,
};
const gameXoSoMBReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case SET_TIMER_XOSO_MB:
      return {
        ...state,
        timerOpen: payload.data.timerOpen,
        timerStopBet: payload.data.timerStopBet,
      };
    case SET_PHIEN_XOSO_MB:
      return {
        ...state,
        currentDate: payload.data.currentDate,
        latestCompleteDate: payload.data.latestCompleteDate,
      };
    case SET_TINH_TRANG_XOSO_MB:
      return {
        ...state,
        tinhTrang: payload.data,
      };
    case SET_KET_QUA_PHIEN_TRUOC_XOSO_MB:
      return {
        ...state,
        phienHoanTatMoiNhat: payload.data,
      };
    case SET_KET_QUA_XOSO_MB:
      return {
        ...state,
        ketQua: payload.data,
      };
    case SET_IS_PLAY_GAME_XOSO_MB:
      return {
        ...state,
        isPlayGame: payload.data,
      };
    default:
      return state;
  }
};
export default gameXoSoMBReducer;
