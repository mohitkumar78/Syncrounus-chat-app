import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: ""

};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token
            console.log(action.payload.user)
            console.log(state.user)
        },
        updateUser: (state, action) => {
            console.log(action.payload);
            if (state.user && state.user._id === action.payload.user._id) {
                state.user = { ...state.user, ...action.payload.user };
            }
            console.log(state.user); // Updated user object
        },
        logout: (state, action) => {
            state.user = null,
                state.token = ""
        }


    },
});

// Correctly export the setUser action
export const { setUser, updateUser, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
