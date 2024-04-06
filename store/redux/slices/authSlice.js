import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null,
  username: null,
  avatar: null,
  fullname: null,
  bio: null,
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
      state.fullname = action.payload.fullname;
      state.bio = action.payload.bio;
    },
    logoutUser(state) {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, setLoginInfo,logoutUser } = tokenSlice.actions;
export default tokenSlice.reducer;
