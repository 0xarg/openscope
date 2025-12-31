import axios from "axios";
import { signOut } from "next-auth/react";

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await signOut({ callbackUrl: "/" });
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
