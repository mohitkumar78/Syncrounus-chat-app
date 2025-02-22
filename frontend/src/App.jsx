import react from "react";
import Auth from "./Auth/auth";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Profile from "./Auth/Profile";
import CloudinaryUpload from "./Auth/Demo";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Chat from "./Chats/Chat";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<CloudinaryUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
