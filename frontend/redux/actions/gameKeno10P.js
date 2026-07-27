import {
  SET_IS_PLAY_GAME_KENO_10P,
  SET_KET_QUA_KENO_10P,
  SET_KET_QUA_PHIEN_TRUOC_KENO_10P,
  SET_PHIEN_KENO_10P,
  SET_TIMER_KENO_10P,
  SET_TINH_TRANG_KENO_10P,
} from "./constants";
export const setTimer = (value) => (dispatch) => {
  dispatch({
    type: SET_TIMER_KENO_10P,
    data: value,
  });
};
export const setPhien = (value) => (dispatch) => {
  dispatch({
    type: SET_PHIEN_KENO_10P,
    data: value,
  });
};
export const setTinhTrang = (value) => (dispatch) => {
  dispatch({
    type: SET_TINH_TRANG_KENO_10P,
    data: value,
  });
};
export const setKetQuaPhienTruoc = (value) => (dispatch) => {
  dispatch({
    type: SET_KET_QUA_PHIEN_TRUOC_KENO_10P,
    data: value,
  });
};
export const setKetQua = (value) => (dispatch) => {
  dispatch({
    type: SET_KET_QUA_KENO_10P,
    data: value,
  });
};
export const setIsPlayGame = (value) => (dispatch) => {
  dispatch({
    type: SET_IS_PLAY_GAME_KENO_10P,
    data: value,
  });
};
