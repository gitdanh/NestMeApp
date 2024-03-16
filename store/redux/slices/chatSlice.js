import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
  messages: null,
  messageRemoves: null,
  socket: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setMessages: (state, action) => {
        state.messages = action.payload;
    },
    setMessageRemoves: (state, action) => {
        state.messageRemoves = action.payload;
    },
  },
});

export const { setSocket, setCurrentChat, setMessages, setMessageRemoves } = chatSlice.actions;
export default chatSlice.reducer;
