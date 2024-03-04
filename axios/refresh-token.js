import { useCallback } from "react";
import useAuth from "../auth-hook/auth-hook";
import useHttpClient from "./public-http-hook";
import { axiosPublic } from "./public-axios";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../store/redux/slices/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const { publicRequest } = useHttpClient();

  const refresh = async () => {
    const response = await publicRequest("/auth/refresh"); // sua lai api truyen vao refresh token nhes

    dispatch(setAccessToken(response.data.accessToken));

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
