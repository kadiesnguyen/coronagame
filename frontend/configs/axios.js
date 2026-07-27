import { getSessionAccessToken, setSessionAccessToken } from "@/utils/sessionToken";
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: `${process.env.ENDPOINT_SERVER}/api`,
});

api.interceptors.request.use(
  async (config) => {
    let token = getSessionAccessToken();
    if (!token && typeof window !== "undefined") {
      try {
        const session = await getSession();
        token = session?.user?.accessToken || null;
        if (token) setSessionAccessToken(token);
      } catch (_err) {
        // ignore
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
