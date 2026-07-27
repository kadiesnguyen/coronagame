import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setBalance, updateBalance } from "../redux/actions/balance";

const useRegisterUserBalanceSocket = ({ value }) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (value.isConnected && value.socket) {
      value.socket.emit("get-current-balance", session.user.taiKhoan, (res) => {
        if (res && res.status === "success") {
          dispatch(setBalance(res.data));
        } else if (res && res.status === "error") {
          toast.error("Có lỗi xảy ra khi lấy thông tin tiền tệ");
        }
      });

      value.socket.on("set-current-balance", (data) => {
        dispatch(setBalance(data));
      });
      value.socket.on("update-current-balance", (data) => {
        dispatch(updateBalance(data));
      });

      return () => {
        value.socket.off("set-current-balance");
        value.socket.off("update-current-balance");
      };
    }
  }, [value]);
  return value;
};
export default useRegisterUserBalanceSocket;
