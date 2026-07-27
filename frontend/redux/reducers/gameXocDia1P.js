import { TINH_TRANG_GAME } from "../../configs/game.xocdia.config";
import {
  SET_IS_PLAY_GAME_XOCDIA_1P,
  SET_KET_QUA_PHIEN_TRUOC_XOCDIA_1P,
  SET_KET_QUA_XOCDIA_1P,
  SET_PHIEN_XOCDIA_1P,
  SET_TIMER_XOCDIA_1P,
  SET_TINH_TRANG_XOCDIA_1P,
} from "../actions/constants";
const initialState = {
  isPlayGame: true,
  phien: 0,
  timer: 60,
  ketQua: [0, 0, 0, 0],
  phienHoanTatMoiNhat: {},
  tinhTrang: TINH_TRANG_GAME.DANG_CHO,
};
const gameXocDia1PReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case SET_TIMER_XOCDIA_1P:
      return {
        ...state,
        timer: payload.data,
      };
    case SET_PHIEN_XOCDIA_1P:
      return {
        ...state,
        phien: payload.data,
      };
    case SET_TINH_TRANG_XOCDIA_1P:
      return {
        ...state,
        tinhTrang: payload.data,
      };
    case SET_KET_QUA_PHIEN_TRUOC_XOCDIA_1P:
      return {
        ...state,
        phienHoanTatMoiNhat: payload.data,
      };
    case SET_KET_QUA_XOCDIA_1P:
      return {
        ...state,
        ketQua: payload.data,
      };
    case SET_IS_PLAY_GAME_XOCDIA_1P:
      return {
        ...state,
        isPlayGame: payload.data,
      };
    default:
      return state;
  }
};
export default gameXocDia1PReducer;
