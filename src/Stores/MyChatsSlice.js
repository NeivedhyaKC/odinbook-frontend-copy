import { createSlice } from "@reduxjs/toolkit";

const myChatsSlice = createSlice({
  name: "myChats",
  initialState : {
    chats: [],
    chatSelected: null,
    messages: [],
  },
  reducers:
  {
    chatAdded: (state, action) =>
    {
      for (let chat of state.chats)
      {
        if (chat._id === action.payload.chatAdded._id)
        {
          return state;  
        }
      }
      return { ...state, chats: [...state.chats, action.payload.chatAdded] };
    },
    pushNotification: (state, action) =>
    {
      for (let chat of state.chats)
      {
        if (chat._id === action.payload.latestMessage.chat._id)
        {
          chat.latestMessage = action.payload.latestMessage;  
        }
      }
    },
    chatsSet: (state, action) =>
    {
      state.chats = action.payload.chats;
    },
    selectedChatSet: (state, action) =>
    {
      state.chatSelected = action.payload.chatSelected;  
    },
    messagesSet: (state, action) =>
    {
      state.messages = action.payload.messages
    },
    messagesAdd: (state, action) =>
    {
      state.messages.push(action.payload.message)  
    }
  }
})

export const { chatAdded, chatsSet, pushNotification,selectedChatSet, messagesSet, messagesAdd } = myChatsSlice.actions;

export default myChatsSlice;