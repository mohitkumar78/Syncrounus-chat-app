import React, { useEffect } from "react";
import {
  setSelectedChatData,
  setChatType,
  setSelectedChat,
} from "../Store/contact-slice";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  setSelectedChannelData,
  setSelectedChannelChat,
} from "../Store/channel-slice";

function ContactList({ contacts = [], ischannel = false }) {
  const dispatch = useDispatch();

  const { selectedChatData } = useSelector((store) => store.contact);
  const { selectedChannelData } = useSelector((store) => store.channel);

  // Helper to determine active chat/channel
  const isActive = (contact) => {
    if (ischannel) {
      return selectedChannelData && selectedChannelData._id === contact._id;
    } else {
      return selectedChatData && selectedChatData._id === contact._id;
    }
  };

  // On initial render, if no chat/channel is selected, select the first one.
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const firstContact = contacts[0];
      if (ischannel) {
        if (!selectedChannelData) {
          dispatch(setChatType({ chatType: "channel" }));
          dispatch(setSelectedChannelData({ channel: firstContact }));
          dispatch(setSelectedChannelChat({ message: [] }));
        }
      } else {
        if (!selectedChatData) {
          dispatch(setChatType({ chatType: "contact" }));
          dispatch(setSelectedChatData({ contact: firstContact }));
          dispatch(setSelectedChat({ message: [] }));
        }
      }
    }
  }, [contacts, ischannel, dispatch, selectedChatData, selectedChannelData]);

  const handleClick = (contact) => {
    console.log("Contact clicked:", contact);

    if (ischannel) {
      // Clear channel messages if switching channels
      console.log(ischannel);
      if (selectedChannelData && selectedChannelData._id !== contact._id) {
        console.log("Switching channel, clearing previous channel messages...");
        dispatch(setSelectedChannelChat({ message: [] }));
      }
      dispatch(setChatType({ chatType: "channel" }));
      dispatch(setSelectedChannelData({ channel: contact }));
    } else {
      // Clear contact messages if switching contacts
      if (selectedChatData && selectedChatData._id !== contact._id) {
        console.log("Switching chat, clearing previous messages...");
        dispatch(setSelectedChat({ message: [] }));
      }
      dispatch(setChatType({ chatType: "contact" }));
      dispatch(setSelectedChatData({ contact }));
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-5 overflow-hidden">
      {contacts && contacts.length > 0 ? (
        contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => handleClick(contact)}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out overflow-hidden
              ${
                isActive(contact)
                  ? "bg-[#6a11cb] text-white scale-105"
                  : "hover:bg-[#f1f1f1] dark:hover:bg-[#333] text-gray-900 dark:text-gray-300"
              }`}
            style={{ maxWidth: "100%", width: "100%", whiteSpace: "nowrap" }}
          >
            {ischannel ? (
              <div className="flex items-center gap-4">
                {/* Channel Rendering Logic */}
                <Avatar className="w-12 h-12 rounded-full border-2 border-[#f03a17] shadow-md">
                  <div className="flex items-center justify-center w-full h-full text-white font-semibold text-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
                    {contact?.name?.charAt(0) || ""}
                  </div>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-lg font-medium text-gray-300 truncate">
                    {contact?.name}
                  </span>
                  <span className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {contact?.description}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Avatar className="w-12 h-12 rounded-full border-2 border-[#f03a17] shadow-md transform transition-transform duration-300 hover:scale-110">
                  {contact?.image ? (
                    <AvatarImage
                      src={contact.image}
                      alt="profile"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white font-semibold text-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
                      {contact?.firstname?.charAt(0) || ""}{" "}
                      {contact?.lastname?.charAt(0) || ""}
                    </div>
                  )}
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-lg font-medium text-gray-300 truncate">
                    {contact?.firstname} {contact?.lastname}
                  </span>
                  <span className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {contact?.email}
                  </span>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No contacts available</p>
      )}
    </div>
  );
}

export default ContactList;
