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
  const dispatch = useDispatch();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5">
      {/* Left Section - User Details */}
      {selectedchatType === "contact" && selectedChatData && (
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 rounded-full shadow-lg border-4 border-[#f03a17] bg-gray-700 flex items-center justify-center overflow-hidden">
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
            <span className="text-lg font-medium">
              {selectedChatData?.firstname} {selectedChatData?.lastname}
            </span>
            <span className="text-sm text-gray-400">
              {selectedChatData?.email}
            </span>
          </div>
        </div>
      )}

      {/* Right Section - Close Button */}
      <button
        className="transition-all duration-300 text-neutral-500 hover:text-white focus:outline-none"
        onClick={() => dispatch(closeChat())}
      >
        <RiCloseFill className="text-3xl" />
      </button>
    </div>
  );
}

export default ChatHeader;
