import { setSessionAccessToken } from "@/utils/sessionToken";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

/** Đồng bộ session.user.accessToken → cache cho axios interceptor. */
const SessionTokenBridge = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setSessionAccessToken(session?.user?.accessToken || null);
    } else if (status === "unauthenticated") {
      setSessionAccessToken(null);
    }
  }, [session?.user?.accessToken, status]);

  return null;
};

export default SessionTokenBridge;
