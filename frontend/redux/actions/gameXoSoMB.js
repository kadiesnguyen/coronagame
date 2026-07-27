import {
  SET_IS_PLAY_GAME_XOSO_MB,
  SET_KET_QUA_PHIEN_TRUOC_XOSO_MB,
  SET_KET_QUA_XOSO_MB,
  SET_PHIEN_XOSO_MB,
  SET_TIMER_XOSO_MB,
  SET_TINH_TRANG_XOSO_MB,
} from "./constants";
export const setTimer = (value) => (dispatch) => {
  dispatch({
    type: SET_TIMER_XOSO_MB,
    data: value,
  });
};
export const setPhien = (value) => (dispatch) => {
  dispatch({
    type: SET_PHIEN_XOSO_MB,
    data: value,
  });
};
export const setTinhTrang = (value) => (dispatch) => {
  dispatch({
    type: SET_TINH_TRANG_XOSO_MB,
    data: value,
  });
};
export const setKetQuaPhienTruoc = (value) => (dispatch) => {
  dispatch({
    type: SET_KET_QUA_PHIEN_TRUOC_XOSO_MB,
    data: value,
  });
};
export const setKetQua = (value) => (dispatch) => {
  dispatch({
    type: SET_KET_QUA_XOSO_MB,
    data: value,
  });
};
export const setIsPlayGame = (value) => (dispatch) => {
  dispatch({
    type: SET_IS_PLAY_GAME_XOSO_MB,
    data: value,
  });
};
