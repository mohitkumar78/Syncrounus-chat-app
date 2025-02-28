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
            state.token = action.payload.token;

            // Correct way to store user and token in localStorage

        },
        updateUser: (state, action) => {
            console.log(action.payload);
            if (state.user && state.user._id === action.payload.user._id) {
                state.user = { ...state.user, ...action.payload.user };
            }
            console.log(state.user); // Updated user object
        },
        logout: (state) => {
            state.user = null;
            state.token = "";

            // Remove user and token from localStorage

        }
    },
});

// Export actions
export const { setUser, updateUser, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
