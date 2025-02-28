import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../Store/contact-slice";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import "./Scroolbar.css";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { setSelectedChannelChat } from "../../Store/channel-slice";
function Message_Container() {
  const dispatch = useDispatch();
  const { selectedChannelChat, selectedChannelData } = useSelector(
    (store) => store.channel
  );

  const [showImage, setShowImage] = useState(false);
  const [ImageUrl, setImageUrl] = useState(null);
  const { user, token } = useSelector((store) => store.auth);

  const {
    selectedChatMessage,
    selectedChatData,
    selectedchatType, // Updated to camelCase
  } = useSelector((store) => store.contact);

  const messageContainerRef = useRef();
  const scrollRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if file is an image
  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|bmp|tiff|webp|svg|ico|heic|hefif)$/i;
    return imageRegex.test(filePath);
  };

  // Fetch messages from API if contact chat is selected
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/message/getAllmessage",
          { token, recipient: selectedChatData?._id },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.messages) {
          dispatch(setSelectedChat({ message: response.data.messages }));
        }
      } catch (error) {
        console.log("Error in fetching message history:", error);
      }
    };
    const getChannelMessage = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/channels/getChannelMessage",
          {
            channelId: selectedChannelData._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        dispatch(setSelectedChannelChat({ message: response.data.message }));
      } catch (error) {
        console.log("error is Occur while getting all channel message", error);
      }
    };
    if (selectedChatData?._id && selectedchatType === "contact") {
      getMessage();
    } else if (selectedChannelData?._id && selectedchatType === "channel") {
      getChannelMessage();
    }
  }, [
    selectedChatData,
    selectedChannelData,
    selectedchatType,
    token,
    dispatch,
  ]);

  // Track scroll position to check if user is at the bottom
  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10); // 10px margin
    }
  };

  // Only scroll to bottom if user is at bottom
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage, selectedChannelChat, isAtBottom]);

  // File download function
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

  // Render messages based on selected chat type
  const renderMessage = () => {
    if (
      selectedchatType === "contact" &&
      (!Array.isArray(selectedChatMessage) || selectedChatMessage.length === 0)
    ) {
      return <div className="text-center text-gray-500">No messages yet.</div>;
    }
    if (
      selectedchatType === "channel" &&
      (!Array.isArray(selectedChannelChat) || selectedChannelChat.length === 0)
    ) {
      return (
        <div className="text-center text-gray-500">
          No channel messages yet.
        </div>
      );
    }

    if (selectedchatType === "contact") {
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
            {selectedchatType === "contact" && renderDmMessage(message)}
          </div>
        );
      });
    } else if (selectedchatType === "channel") {
      let lastDate = null;
      return selectedChannelChat.map((message, index) => {
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
            {selectedchatType === "channel" && renderChannelMessage(message)}
          </div>
        );
      });
    }
  };

  // Render channel message placeholder
  const renderChannelMessage = (message) => {
    const isSender = message.sender._id === user?._id;

    return (
      <div
        className={`flex my-2 px-2 ${
          isSender ? "justify-end" : "justify-start"
        }`}
      >
        {!isSender && (
          <Avatar className="w-10 h-10 rounded-full border-2 border-[#f03a17] shadow-md mr-2">
            {message?.sender?.image ? (
              <AvatarImage
                src={message?.sender?.image}
                alt="profile"
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white font-semibold text-lg bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
                {message?.sender?.firstname?.charAt(0) || ""}
              </div>
            )}
          </Avatar>
        )}

        <div
          className={`p-3 rounded-xl max-w-[75%] sm:max-w-[60%] shadow-md transition-all transform hover:scale-[1.02] ${
            isSender
              ? "bg-[#8417ff] text-white border border-[#6b11cc]"
              : "bg-[#2a2b33] text-white border border-[#ffffff]/20"
          }`}
        >
          {message.messageType === "text" && (
            <div>
              <p className="text-sm leading-5 break-words">
                {message?.content}
              </p>
              <div className="mt-1 text-xs text-right text-gray-400">
                {moment(message?.timestamp).format("LT")}
              </div>
            </div>
          )}

          {message.messageType === "file" && (
            <div>
              {checkImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setImageUrl(message.fileUrl);
                    setShowImage(true);
                  }}
                >
                  <img
                    src={`http://localhost:5000/${message.fileUrl}`}
                    alt="Uploaded file"
                    className="w-full max-w-[250px] rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-black/10">
                  <span className="p-2 text-2xl text-white rounded-full bg-black/20">
                    <MdFolderZip />
                  </span>
                  <span className="text-sm truncate max-w-[150px]">
                    {message.fileUrl.split("/").pop()}
                  </span>
                  <span
                    className="p-2 text-2xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
                    onClick={() => FileDownload(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render individual DM message
  const renderDmMessage = (message) => {
    const isSender = message.sender === user?._id;

    return (
      <div
        className={`flex my-2 ${
          isSender ? "justify-start" : "justify-end"
        } px-2`}
      >
        {message.messageType === "text" && (
          <div
            className={`p-3 rounded-lg max-w-[80%] sm:max-w-[60%] break-words shadow-md transition-all transform scale-95 hover:scale-100 ${
              isSender
                ? "bg-[#8417ff] text-white border border-[#6b11cc] self-start"
                : "bg-[#2a2b33] text-white border border-[#ffffff]/20 self-end"
            }`}
          >
            {message?.content}
            <div className="mt-1 text-xs text-gray-400">
              {moment(message?.timestamp).format("LT")}
            </div>
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`p-3 rounded-lg max-w-[80%] sm:max-w-[60%] break-words shadow-md transition-all transform scale-95 hover:scale-100 ${
              isSender
                ? "bg-[#8417ff]/50 text-white border border-solid self-start"
                : "bg-[#2a2b33] text-white border border-[#ffffff]/20 self-end"
            }`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setImageUrl(message.fileUrl);
                  setShowImage(true);
                }}
              >
                <img
                  src={`http://localhost:5000/${message.fileUrl}`}
                  alt="Uploaded file"
                  className="w-full max-w-[300px] bg-cover h-auto rounded-md"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="p-3 text-3xl rounded-full text-white/80 bg-black/20">
                  <MdFolderZip />
                </span>
                <span className="block mt-1 text-sm">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="p-3 text-3xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
                  onClick={() => FileDownload(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={messageContainerRef}
      onScroll={handleScroll}
      className="flex-1 w-full p-4 px-4 sm:px-8 overflow-y-auto max-h-[80vh] custom-scrollbar"
    >
      {renderMessage()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`http://localhost:5000/${ImageUrl}`}
              alt="Uploaded file"
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="top-0 flex gap-4 mt-6">
            <button
              className="p-3 text-3xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
              onClick={() => FileDownload(ImageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="p-3 text-3xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message_Container;
