import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: `${process.env.ENDPOINT_SERVER}/api`,
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    let session;
    if (typeof window != "undefined") {
      session = await getSession();
    }

    if (session) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
