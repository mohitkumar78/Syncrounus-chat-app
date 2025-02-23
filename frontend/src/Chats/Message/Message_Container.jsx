import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../Store/contact-slice";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import axios from "axios";
import { getColor } from "@/Utils/Utils";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "./Scroolbar.css";

function Message_Container() {
  const dispatch = useDispatch();
  const [showImage, setShowImage] = useState(false);
  const [ImageUrl, setImageUrl] = useState(null);
  const { user, token } = useSelector((store) => store.auth);
  const { selectedChatMessage, selectedChatData, selectedchatType } =
    useSelector((store) => store.contact);
  console.log("Messages:", selectedChatMessage);
  const scrollRef = useRef();

  const checkImage = (filePath) => {
    const imageRegax = /\.(jpg|jpeg|png|bmp|tiff|webp|svg|ico|heic|hefif)$/i;
    return imageRegax.test(filePath);
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/message/getAllmessage",
          { token, recipient: selectedChatData?._id },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.messages) {
          console.log("Fetched messages from API:", response.data.messages);
          dispatch(setSelectedChat({ message: response.data.messages }));
        }
      } catch (error) {
        console.log("Error in fetching message history:", error);
      }
    };

    if (
      selectedChatData?._id &&
      (selectedchatType === "contact" || selectedchatType === "channel")
    ) {
      getMessage();
    }
  }, [selectedChatData, selectedchatType, token, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);

  const FileDownload = async (url) => {
    try {
      const response = await fetch(`http://localhost:5000/${url}`);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = url.split("/").pop(); // Extract filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const renderMessage = () => {
    if (
      !Array.isArray(selectedChatMessage) ||
      selectedChatMessage.length === 0
    ) {
      return <div className="text-center text-gray-500">No messages yet.</div>;
    }
    console.log(selectedChatMessage);
    let lastDate = null;
    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index} className="fade-in">
          {showDate && (
            <div className="my-2 text-center text-gray-500">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {renderChatMessage(message)}
        </div>
      );
    });
  };

  const renderChatMessage = (message) => {
    const senderId = message.sender?._id || message.sender;
    const isSender = senderId === user?._id;

    return (
      <div
        className={`flex ${
          isSender ? "justify-end" : "justify-start"
        } my-2 px-2 w-full`}
      >
        {!isSender && (
          <Avatar className="w-10 h-10 mr-2">
            {message.sender?.image ? (
              <AvatarImage
                src={message.sender.image}
                alt="profile"
                className="object-cover"
              />
            ) : (
              <div
                className={`text-white flex items-center justify-center w-full h-full font-semibold ${getColor(
                  message.sender?.color
                )}`}
              >
                {message.sender?.firstname?.charAt(0)}{" "}
                {message.sender?.lastname?.charAt(0)}
              </div>
            )}
          </Avatar>
        )}
        <div
          className={`rounded-xl p-3 shadow-md max-w-[75%] text-white ${
            isSender ? "bg-indigo-600" : "bg-gray-800"
          }`}
        >
          {message.messageType === "text" ? (
            <p className="text-base leading-relaxed">{message?.content}</p>
          ) : (
            <img
              src={`http://localhost:5000/${message.fileUrl}`}
              alt="Uploaded file"
              className="w-full max-w-[300px] h-auto rounded-md cursor-pointer"
              onClick={() => {
                setImageUrl(message.fileUrl);
                setShowImage(true);
              }}
            />
          )}
          <div className="mt-1 text-xs text-right text-gray-400">
            {moment(message?.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full p-4 px-4 sm:px-8 overflow-y-auto max-h-[80vh] custom-scrollbar bg-gray-900 rounded-lg shadow-lg">
      {renderMessage()}
      <div ref={scrollRef}></div>

      {showImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50">
          <div className="relative p-4">
            <img
              src={`http://localhost:5000/${ImageUrl}`}
              alt="Uploaded file"
              className="h-[80vh] w-auto max-w-full rounded-lg shadow-lg"
            />
            <button
              className="absolute p-2 text-white transition bg-gray-800 rounded-full top-2 right-2 hover:bg-red-500"
              onClick={() => setShowImage(false)}
            >
              <IoCloseSharp size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message_Container;
