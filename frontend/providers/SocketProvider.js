import useRegisterGameXoSo3PSocket from "@/hooks/useRegisterGameXoSo3PSocket";
import useRegisterGameXoSo5PSocket from "@/hooks/useRegisterGameXoSo5PSocket";
import useRegisterGameXoSoMBSocket from "@/hooks/useRegisterGameXoSoMBSocket";
import useRegisterGameXocDia1PSocket from "@/hooks/useRegisterGameXocDia1PSocket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import SocketContext from "../context/socket";
import useRegisterGameKeno1PSocket from "../hooks/useRegisterGameKeno1PSocket";
import useRegisterGameKeno3PSocket from "../hooks/useRegisterGameKeno3PSocket";
import useRegisterGameKeno5PSocket from "../hooks/useRegisterGameKeno5PSocket";
import useRegisterGameXucXac1PSocket from "../hooks/useRegisterGameXucXac1PSocket";
import useRegisterGameXucXac3PSocket from "../hooks/useRegisterGameXucXac3PSocket";
import useRegisterUserBalanceSocket from "../hooks/useRegisterUserBalanceSocket";

const SocketProvider = (props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [value, setValue] = useState({
    isConnected: false,
    socket: null,
  });

  useEffect(() => {
    if (status === "authenticated") {
      socketInitializer();
      return () => {
        if (value.socket) {
          value.socket.disconnect();
        }
      };
    }
  }, [status]);

  useRegisterUserBalanceSocket({ value });
  useRegisterGameKeno1PSocket({ value });
  useRegisterGameKeno3PSocket({ value });
  useRegisterGameKeno5PSocket({ value });
  useRegisterGameXucXac1PSocket({ value });
  useRegisterGameXucXac3PSocket({ value });
  useRegisterGameXocDia1PSocket({
    value,
  });
  useRegisterGameXoSo3PSocket({
    value,
  });
  useRegisterGameXoSo5PSocket({
    value,
  });
  useRegisterGameXoSoMBSocket({
    value,
  });

  const socketInitializer = () => {
    const socket = io(process.env.ENDPOINT_SERVER, {
      auth: {
        token: `Bearer ${session.user.accessToken}`,
      },
    });

    socket.on("connect", () => {
      setValue((state) => ({
        ...state,
        isConnected: socket.connected,
        socket: socket,
      }));
    });
    socket.on("disconnect", () => {
      setValue((state) => ({
        ...state,
        isConnected: socket.connected,
        socket: socket,
      }));
    });
    socket.on("connect_error", (err) => {
      setValue((state) => ({
        ...state,
        isConnected: socket.connected,
        socket: socket,
      }));
      console.log("error", err);
      // router.push("/sign-out");
      toast.error("Lỗi kết nối đến máy chủ", {
        toastId: "error_connect_socket",
      });
    });
  };
  return <SocketContext.Provider value={value}>{props.children}</SocketContext.Provider>;
};
export default SocketProvider;
