import handleLogout from "@/utils/logout";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
const useCatchRefreshTokenError = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      handleLogout(session);
    }
  }, [session]);

  return null;
};

export default useCatchRefreshTokenError;
