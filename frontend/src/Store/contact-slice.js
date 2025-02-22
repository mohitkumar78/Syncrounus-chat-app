import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedchatType: undefined,
    DirectMessagesContacts: [],
    selectedChatData: null,
    selectedChatMessage: [],
};

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        setChatType: (state, action) => {
            state.selectedchatType = action.payload.chatType;
        },
        setSelectedChatData: (state, action) => {
            state.selectedChatData = action.payload.contact;
        },
        closeChat: (state) => {
            state.selectedchatType = undefined;
            state.selectedChatData = null;
            state.selectedChatMessage = [];
        },
        setSelectedChat: (state, action) => {
            console.log("Updating chat store...");
            console.log(action.payload.message);
            if (!action.payload || action.payload.length === 0) {
                console.log("Clearing chat messages...");
                state.selectedChatMessage = [];
                return;
            }

            if (Array.isArray(action.payload.message)) {
                console.log("Setting full chat history...");
                state.selectedChatMessage = action.payload.message.map((msg) => ({
                    content: msg?.content || "",
                    fileUrl: msg?.fileUrl || "",
                    messageType: msg?.messageType || "text",
                    recipient: msg?.recipient?._id || msg?.recipient || "",
                    sender: msg?.sender?._id || msg?.sender || "",
                    timestamp: msg?.timestamp || new Date().toISOString(),
                }));
            } else {
                console.log("Appending new message...");
                state.selectedChatMessage.push({
                    content: action.payload.message?.content || "",
                    messageType: action.payload.message?.messageType || "text",
                    fileUrl: action.payload.message?.fileUrl || "",
                    recipient:
                        action.payload.message?.recipient?._id ||
                        action.payload.message?.recipient ||
                        "",
                    sender:
                        action.payload.message?.sender?._id ||
                        action.payload.message?.sender ||
                        "",
                    timestamp:
                        action.payload.message?.timestamp || new Date().toISOString(),
                });
            }
        },
        setDirectContactList: (state, action) => {
            state.DirectMessagesContacts = action.payload.contacts;
        },
    },
});

export const {
    setChatType,
    setSelectedChatData,
    closeChat,
    setSelectedChat,
    setDirectContactList,
} = contactSlice.actions;
export default contactSlice.reducer;
