import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import Auth from "./Auth/auth";
import Profile from "./Auth/Profile";

import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Chat from "./Chats/Chat";

function App() {
  const { token, user } = useSelector((store) => store.auth);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Default route handling */}
        <Route path="/" element={<Auth />} />

        {/* Auth and Login Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        {user && token ? (
          <>
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/auth" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
