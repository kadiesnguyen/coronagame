import { TINH_TRANG_GAME } from "../../configs/game.keno.config";
import {
  SET_IS_PLAY_GAME_KENO_3P,
  SET_KET_QUA_KENO_3P,
  SET_KET_QUA_PHIEN_TRUOC_KENO_3P,
  SET_PHIEN_KENO_3P,
  SET_TIMER_KENO_3P,
  SET_TINH_TRANG_KENO_3P,
} from "../actions/constants";
const initialState = {
  isPlayGame: true,
  phien: 0,
  timer: 180,
  ketQua: [0, 0, 0, 0, 0],
  phienHoanTatMoiNhat: {},
  tinhTrang: TINH_TRANG_GAME.DANG_CHO,
};
const gameKeno3PReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case SET_TIMER_KENO_3P:
      return {
        ...state,
        timer: payload.data,
      };
    case SET_PHIEN_KENO_3P:
      return {
        ...state,
        phien: payload.data,
      };
    case SET_TINH_TRANG_KENO_3P:
      return {
        ...state,
        tinhTrang: payload.data,
      };
    case SET_KET_QUA_PHIEN_TRUOC_KENO_3P:
      return {
        ...state,
        phienHoanTatMoiNhat: payload.data,
      };
    case SET_KET_QUA_KENO_3P:
      return {
        ...state,
        ketQua: payload.data,
      };
    case SET_IS_PLAY_GAME_KENO_3P:
      return {
        ...state,
        isPlayGame: payload.data,
      };
    default:
      return state;
  }
};
export default gameKeno3PReducer;
