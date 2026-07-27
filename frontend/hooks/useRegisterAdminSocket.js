import { KEYS_SOCKET_ADMIN } from "@/configs/admin.socket.config";
import SocketContext from "@/context/socket";
import { setListUsersSocket } from "@/redux/actions/admin";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";

const useRegisterAdminSocket = () => {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      socket.emit(KEYS_SOCKET_ADMIN.JOIN_ROOM_ADMIN);

      socket.on(KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE, (data) => {
        dispatch(setListUsersSocket(data));
      });
      return () => {
        socket.off(KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE);
      };
    }
  }, [socket]);
  return null;
};
export default useRegisterAdminSocket;
