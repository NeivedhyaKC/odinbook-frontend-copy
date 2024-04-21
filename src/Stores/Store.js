import { configureStore } from "@reduxjs/toolkit";
import myChatsSlice from "./MyChatsSlice";

export default configureStore({
    reducer:
    {
        myChats : myChatsSlice.reducer
    }
})
