import { LOAI_GAME } from "@/configs/game.config";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TINH_TRANG_GAME } from "../configs/game.xoso.config";
import { setKetQua, setKetQuaPhienTruoc, setPhien, setTimer, setTinhTrang } from "../redux/actions/gameXoSoMB";

const useRegisterGameXoSoMBSocket = ({ value }) => {
  const dispatch = useDispatch();

  const { isPlayGame: isPlayGameXoSoMB } = useSelector((state) => state.gameXoSoMB);

  useEffect(() => {
    const key_socket = LOAI_GAME.XOSOMB;
    if (value.isConnected && value.socket) {
      if (isPlayGameXoSoMB) {
        value.socket.emit(`${key_socket}:join-room`);
        value.socket.on(`${key_socket}:hienThiPhien`, ({ currentDate, latestCompleteDate }) => {
          dispatch(setPhien({ currentDate, latestCompleteDate }));
        });
        value.socket.on(`${key_socket}:timer`, ({ timerOpen, timerStopBet }) => {
          dispatch(setTimer({ timerOpen, timerStopBet }));
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
          value.socket.off(`${key_socket}:batDauGame`);
          value.socket.off(`${key_socket}:batDauQuay`);
          value.socket.off(`${key_socket}:dungQuay`);
          value.socket.off(`${key_socket}:hoanTatGame`);
          value.socket.off(`${key_socket}:ketqua`);
          value.socket.off(`${key_socket}:phienHoanTatMoiNhat`);
        };
      } else {
        value.socket.off(`${key_socket}:hienThiPhien`);
        value.socket.off(`${key_socket}:timer`);
        value.socket.off(`${key_socket}:batDauGame`);
        value.socket.off(`${key_socket}:batDauQuay`);
        value.socket.off(`${key_socket}:dungQuay`);
        value.socket.off(`${key_socket}:hoanTatGame`);
        value.socket.off(`${key_socket}:ketqua`);
        value.socket.off(`${key_socket}:phienHoanTatMoiNhat`);
      }
    }
  }, [value, isPlayGameXoSoMB]);
  return isPlayGameXoSoMB;
};
export default useRegisterGameXoSoMBSocket;
