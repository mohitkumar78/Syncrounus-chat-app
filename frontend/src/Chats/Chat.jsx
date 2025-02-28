import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Chat_Container from "./Chat_Container";

import Chat_contact from "./Chat_contact";
import { toast } from "react-toastify";
function Chat() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    toast.error("Please Rigister ");
    navigate("/signup");
  }

  if (!user.profilesetup) {
    toast.error("Setup Your Profile ");
    navigate("/profile");
  }

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <Chat_contact />

      <Chat_Container />
    </div>
  );
}

export default Chat;
