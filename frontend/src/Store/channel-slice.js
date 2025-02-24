import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channels: [],
    selectedChannelData: null,
    selectedChannelChat: []
};

const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        // Replace "Channel" with "channels" for clarity if setting multiple channels
        setChannel: (state, action) => {
            console.log("set channel is called", action.payload.Channel);
            state.channels = action.payload.Channel;
        },
        // If adding a single channel, consider using action.payload.channel
        addChannel: (state, action) => {
            state.channels = [...state.channels, action.payload.Channel];
        },
        setSelectedChannelData: (state, action) => {
            state.selectedChannelData = action.payload.channel
        },
        setSelectedChannelChat: (state, action) => {
            console.log("Updating chat store...");

            if (!state.selectedChannelChat) {
                state.selectedChannelChat = [];
            }

            if (Array.isArray(action.payload.message)) {
                console.log("Setting full chat history...");
                state.selectedChannelChat = [
                    ...action.payload.message.map(msg => ({
                        content: msg.content,
                        fileUrl: msg.fileUrl,
                        messageType: msg.messageType,
                        sender: msg.sender,
                        timestamp: msg.timestamp,
                    })),
                ];
            } else {
                console.log("Appending new message...");
                state.selectedChannelChat.push({
                    content: action.payload.message.content,
                    messageType: action.payload.message.messageType,
                    fileUrl: action.payload.message.fileUrl,

                    sender: action.payload.message.sender,
                    timestamp: action.payload.message.timestamp,
                });
            }
        },

    }
});

// Exporting actions
export const { setChannel, addChannel, setSelectedChannelData, setSelectedChannelChat } = channelSlice.actions;

// Exporting the reducer (for use in your store configuration)
export default channelSlice.reducer;
