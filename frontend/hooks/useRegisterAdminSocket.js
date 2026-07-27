import { KEYS_SOCKET_ADMIN } from "@/configs/admin.socket.config";
import SocketContext from "@/context/socket";
import { markGameBetSeen, setGameBetAlerts, setGameRoomCounts, setListUsersSocket } from "@/redux/actions/admin";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GAME_ROOM_PATH =
  /^\/admin\/games\/(keno1p|keno3p|keno5p|keno10p|xucxac1p|xucxac3p|xucxac5p|xucxac10p|xocdia1p|xoso3p|xoso5p|xosomb)(?:\/|$)/;

const useRegisterAdminSocket = () => {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const gameBetAlerts = useSelector((state) => state.admin.GAME_BET_ALERTS);

  useEffect(() => {
    if (!socket) return undefined;

    socket.emit(KEYS_SOCKET_ADMIN.JOIN_ROOM_ADMIN);
    socket.emit(KEYS_SOCKET_ADMIN.GET_GAME_ROOM_COUNTS);
    socket.emit(KEYS_SOCKET_ADMIN.GET_GAME_BET_ALERTS);

    const onUsers = (data) => {
      dispatch(setListUsersSocket(data));
    };
    const onRooms = (data) => {
      dispatch(setGameRoomCounts(data));
    };
    const onBetAlerts = (data) => {
      dispatch(setGameBetAlerts(data));
    };

    socket.on(KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE, onUsers);
    socket.on(KEYS_SOCKET_ADMIN.GAME_ROOM_COUNTS, onRooms);
    socket.on(KEYS_SOCKET_ADMIN.GAME_BET_ALERTS, onBetAlerts);

    return () => {
      socket.off(KEYS_SOCKET_ADMIN.LIST_USERS_ONLINE, onUsers);
      socket.off(KEYS_SOCKET_ADMIN.GAME_ROOM_COUNTS, onRooms);
      socket.off(KEYS_SOCKET_ADMIN.GAME_BET_ALERTS, onBetAlerts);
    };
  }, [socket, dispatch]);

  // Admin đang xem trang game → clear badge (kể cả khi có cược mới realtime)
  useEffect(() => {
    const match = router.asPath?.match?.(GAME_ROOM_PATH);
    const room = match?.[1];
    if (!room) return;
    dispatch(markGameBetSeen(room));
  }, [router.asPath, gameBetAlerts, dispatch]);

  return null;
};

export default useRegisterAdminSocket;
