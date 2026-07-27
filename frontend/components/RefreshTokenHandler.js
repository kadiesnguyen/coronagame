import ms from "ms";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const RefreshTokenHandler = ({ setInterval }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      const remainTimeAccessToken = Math.floor((session.user.expireAccessToken - Date.now()) / 1000);

      const fivePercentRemainTimeAccessToken = Math.floor(
        ((ms(process.env.JWT_ACCESSTOKEN_EXPIRED) / 1000) * 50) / 100
      );
      const timeShouldRefreshTime = remainTimeAccessToken - fivePercentRemainTimeAccessToken;
      setInterval(timeShouldRefreshTime > 0 ? timeShouldRefreshTime : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
