import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../Store/contact-slice";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
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

  // Helper function to render messages for both channels and DMs
  const renderChatMessage = (message) => {
    // Determine sender ID:
    const senderId = message.sender?._id || message.sender;
    // If senderId equals the logged-in user ID, then it's a sent message.
    const isSender = senderId === user?._id;

    // Layout: sent messages right aligned, received messages left aligned.
    const containerClasses = isSender
      ? "flex justify-end px-2 my-2"
      : "flex justify-start px-2 my-2";
    const messageClasses = isSender
      ? "bg-[#8417ff] text-white border border-[#6b11cc] rounded-lg p-3 max-w-[80%] sm:max-w-[60%] break-words shadow-md transition-all transform scale-95 hover:scale-100"
      : "bg-[#2a2b33] text-white border border-[#ffffff]/20 rounded-lg p-3 max-w-[80%] sm:max-w-[60%] break-words shadow-md transition-all transform scale-95 hover:scale-100";

    return (
      <div className={containerClasses}>
        {message.messageType === "text" && (
          <div className={messageClasses}>
            {message?.content}
            <div className="mt-1 text-xs text-gray-400">
              {moment(message?.timestamp).format("LT")}
            </div>
          </div>
        )}

        {message.messageType === "file" && (
          <div className={messageClasses}>
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
                  className="w-full max-w-[300px] h-auto rounded-md"
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
            <div className="mt-1 text-xs text-gray-400">
              {moment(message?.timestamp).format("LT")}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full p-4 px-4 sm:px-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
      {renderMessage()}
      <div ref={scrollRef}></div>

      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex flex-col items-center justify-center backdrop-blur-lg">
          <div>
            <img
              src={`http://localhost:4000/${ImageUrl}`}
              alt="Uploaded file"
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-4 mt-6">
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
