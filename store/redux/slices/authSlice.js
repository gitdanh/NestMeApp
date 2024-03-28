import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null,
  username: null,
  avatar: null,
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLoginInfo: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.avatar = action.payload.avatar;
    },
    logoutUser(state) {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, setLoginInfo,logoutUser } = tokenSlice.actions;
export default tokenSlice.reducer;
