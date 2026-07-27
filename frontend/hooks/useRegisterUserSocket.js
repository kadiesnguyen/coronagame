import SocketContext from "@/context/socket";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const useRegisterUserSocket = () => {
  const { socket } = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.on("sign-out", () => {
        router.push(`/sign-out`);
      });

      return () => {
        socket.off("sign-out");
      };
    }
  }, [socket]);
  return null;
};
export default useRegisterUserSocket;
