import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import useRefreshToken from "./refresh-token";

const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,

  withCredentials: false,
  validateStatus: (status) => {
    return status < 500; // Resolve only if the status code is less than 500
  },
});

const useAxiosPrivate = () => {
  const { refresh } = useRefreshToken();
  const accessToken = useSelector((state) => state.authenticate.accessToken);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
