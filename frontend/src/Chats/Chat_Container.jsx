import React from "react";
import Messagebar from "./Message/Messagebar";
import Message_Container from "./Message/Message_Container";
import ChatHeader from "./ChatHeader";
import Empty_Chat from "./Empty_Chat";
import { useSelector } from "react-redux";

function Chat_Container() {
  const { selectedchatType } = useSelector((store) => store.contact);

  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      {selectedchatType === undefined ? <Empty_Chat /> : <Message_Container />}
      <Messagebar />
    </div>
  );
}

export default Chat_Container;
