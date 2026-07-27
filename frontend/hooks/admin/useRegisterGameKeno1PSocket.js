import { setKetQua, setKetQuaPhienTruoc, setPhien, setTimer, setTinhTrang } from "@/redux/actions/gameKeno1P";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TINH_TRANG_GAME } from "../configs/game.keno.config";

const useRegisterGameKeno1PSocket = ({ value }) => {
  const dispatch = useDispatch();

  const { isPlayGame: isPlayGameKeno1P } = useSelector((state) => state.gameKeno1P);

  useEffect(() => {
    const key_socket = "keno1p";
    if (value.isConnected && value.socket) {
      if (isPlayGameKeno1P) {
        value.socket.emit(`${key_socket}:join-room`);
        value.socket.on(`${key_socket}:hienThiPhien`, ({ phien }) => {
          dispatch(setPhien(phien));
        });
        value.socket.on(`${key_socket}:timer`, ({ current_time }) => {
          dispatch(setTimer(current_time));
        });
        value.socket.on(`${key_socket}:ketqua`, ({ ketQuaRandom }) => {
          dispatch(setKetQua(ketQuaRandom));
        });
        value.socket.on(`${key_socket}:batDauGame`, () => {
          dispatch(setTinhTrang(TINH_TRANG_GAME.DANG_CHO));
        });
        value.socket.on(`${key_socket}:batDauQuay`, () => {
          dispatch(setTinhTrang(TINH_TRANG_GAME.DANG_QUAY));
        });
        value.socket.on(`${key_socket}:dungQuay`, () => {
          dispatch(setTinhTrang(TINH_TRANG_GAME.DANG_TRA_THUONG));
        });
        value.socket.on(`${key_socket}:hoanTatGame`, () => {
          dispatch(setTinhTrang(TINH_TRANG_GAME.HOAN_TAT));
        });
        value.socket.on(`${key_socket}:phienHoanTatMoiNhat`, ({ phienHoanTatMoiNhat }) => {
          dispatch(setKetQuaPhienTruoc(phienHoanTatMoiNhat));
        });

        return () => {
          value.socket.off(`${key_socket}:hienThiPhien`);
          value.socket.off(`${key_socket}:timer`);
          value.socket.off(`${key_socket}:running`);
          value.socket.off(`${key_socket}:stop`);
          value.socket.off(`${key_socket}:ketqua`);
          value.socket.off(`${key_socket}:phienHoanTatMoiNhat`);
        };
      } else {
        value.socket.off(`${key_socket}:hienThiPhien`);
        value.socket.off(`${key_socket}:timer`);
        value.socket.off(`${key_socket}:running`);
        value.socket.off(`${key_socket}:stop`);
        value.socket.off(`${key_socket}:ketqua`);
        value.socket.off(`${key_socket}:phienHoanTatMoiNhat`);
      }
    }
  }, [value, isPlayGameKeno1P]);
  return isPlayGameKeno1P;
};
export default useRegisterGameKeno1PSocket;
