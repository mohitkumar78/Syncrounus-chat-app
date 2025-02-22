import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Store/auth-slice.js";
import contactReducer from "./contact-slice.js";
import channelReducer from "./channel-slice.js"
const store = configureStore({
    reducer: {
        auth: authReducer,
        contact: contactReducer,
        channel: channelReducer
    }
});

export { store };
