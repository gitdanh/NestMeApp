import { useCallback } from "react";
import useHttpClient from "./public-http-hook";
import { axiosPublic } from "./public-axios";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../store/redux/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const { publicRequest } = useHttpClient();

  const refresh = async (refreshToken) => {
    const response = await publicRequest("/auth/mrefresh",
    "post",
    {
      refreshToken: refreshToken
    },
    { headers: { "Content-type": "application/json" }}
    ); // sua lai api truyen vao refresh token nhes

    dispatch(setAccessToken(response.data.accessToken));
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

    return response.data;
  };
  return {refresh};
};

export default useRefreshToken;
