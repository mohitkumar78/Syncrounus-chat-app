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

            if (!state.selectedChatMessage) {
                state.selectedChatMessage = [];
            }

            if (Array.isArray(action.payload.message)) {
                console.log("Setting full chat history...");
                state.selectedChatMessage = [
                    ...action.payload.message.map(msg => ({
                        content: msg.content,
                        fileUrl: msg.fileUrl,
                        messageType: msg.messageType,
                        recipient: msg.recipient?._id || msg.recipient,
                        sender: msg.sender?._id || msg.sender,
                        timestamp: msg.timestamp,
                    })),
                ];
            } else {
                console.log("Appending new message...");
                state.selectedChatMessage.push({
                    content: action.payload.message.content,
                    messageType: action.payload.message.messageType,
                    fileUrl: action.payload.message.fileUrl,
                    recipient: action.payload.message.recipient?._id || action.payload.message.recipient,
                    sender: action.payload.message.sender?._id || action.payload.message.sender,
                    timestamp: action.payload.message.timestamp,
                });
            }
        },
        clearChatContainer: (state, action) => {
            state.selectedChatMessage = [];
        },
        setDirectContactList: (state, action) => {
            state.DirectMessagesContacts = action.payload.contacts
        }
    },
});

export const { setChatType, setSelectedChatData, closeChat, clearChatContainer, setSelectedChat, setDirectContactList } = contactSlice.actions;
export default contactSlice.reducer;
