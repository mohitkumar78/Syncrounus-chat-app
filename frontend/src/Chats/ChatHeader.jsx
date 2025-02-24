import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiCloseFill } from "react-icons/ri";
import { closeChat } from "@/Store/contact-slice";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { getColor } from "@/Utils/Utils";

function ChatHeader() {
  const { selectedChatData, selectedchatType } = useSelector(
    (store) => store.contact
  );
  const { selectedChannelData } = useSelector((store) => store.channel);
  const dispatch = useDispatch();

  return (
    <div className="h-[10vh] min-h-[60px] border-b-2 border-[#2f303b] flex items-center justify-between px-5 bg-[#1e1f26] shadow-md">
      {/* Left Section - User Details */}
      {selectedChatData ? (
        selectedchatType === "contact" ? (
          <div className="flex items-center gap-4 w-full max-w-[80%]">
            <Avatar className="w-14 h-14 md:w-12 md:h-12 rounded-full shadow-lg border-4 border-[#f03a17] bg-gray-700 flex items-center justify-center overflow-hidden">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={selectedChatData.image}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`flex items-center justify-center w-full h-full text-white font-semibold text-base ${getColor(
                    selectedChatData?.color
                  )}`}
                >
                  {selectedChatData?.firstname?.charAt(0) || ""}{" "}
                  {selectedChatData?.lastname?.charAt(0) || ""}
                </div>
              )}
            </Avatar>
            <div className="flex flex-col text-white">
              <span className="text-lg font-medium truncate md:text-base">
                {selectedChatData?.firstname} {selectedChatData?.lastname}
              </span>
              <span className="text-sm text-gray-400 truncate">
                {selectedChatData?.email}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Channel Rendering Logic */}
            <Avatar className="w-12 h-12 rounded-full border-2 border-[#f03a17] shadow-md">
              <div className="flex items-center justify-center w-full h-full text-white font-semibold text-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
                {selectedChannelData?.name?.charAt(0) || ""}
              </div>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-lg font-medium text-gray-300 truncate">
                {selectedChannelData?.name}
              </span>
              <span className="text-sm text-gray-500 truncate dark:text-gray-400">
                {selectedChannelData?.description}
              </span>
            </div>
          </div>
        )
      ) : (
        <p className="text-sm text-gray-500 md:text-base">No chat selected</p>
      )}

      {/* Right Section - Close Button */}
      <button
        className="transition-all duration-300 text-neutral-500 hover:text-white focus:outline-none p-2 rounded-full hover:bg-[#ffffff22]"
        onClick={() => dispatch(closeChat())}
      >
        <RiCloseFill className="text-3xl md:text-2xl" />
      </button>
    </div>
  );
}

export default ChatHeader;
