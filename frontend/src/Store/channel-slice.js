import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channels: []
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
        }
    }
});

// Exporting actions
export const { setChannel, addChannel } = channelSlice.actions;

// Exporting the reducer (for use in your store configuration)
export default channelSlice.reducer;
