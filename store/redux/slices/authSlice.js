import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null,
  username: null,
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;