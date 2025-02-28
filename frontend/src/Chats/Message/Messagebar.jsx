import React, { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { useSocket } from "../../Context/ScoketContext";
import { Input } from "@/components/ui/input";
import axios from "axios";

function Messagebar() {
  const { selectedChatData, selectedchatType } = useSelector(
    (store) => store.contact
  );
  const { selectedChannelData } = useSelector((store) => store.channel);

  const { token } = useSelector((store) => store.auth);
  const fileref = useRef();
  const { user } = useSelector((store) => store.auth);
  const emojiRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  console.log(selectedchatType);
  const handleMessage = async () => {
    if (!message.trim()) return;

    if (!socket || !socket.connected) {
      console.log("❌ Socket is not connected! Reconnecting...");
      socket.connect();
      return;
    }

    if (selectedchatType === "contact") {
      const messageData = {
        sender: user._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      };

      socket.emit("sendMessage", messageData);
    } else if (selectedchatType === "channel") {
      const messageData = {
        sender: user._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChannelData._id,
      };
      console.log("sending channel message", messageData);
      socket.emit("send-channel-message", messageData);
    }

    setMessage("");
  };
  const handleFileAttacment = () => {
    if (fileref.current) {
      fileref.current.click();
    }
  };

  const handleAttacmentChange = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        console.warn("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token); // ✅ Add token to formData

      console.log("Sending token:", token); // Debugging

      const response = await axios.post(
        "https://syncrounus-chat-app-1.onrender.com/api/v1/message/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ Add token to headers
          },
        }
      );

      if (response.status === 200 && response.data?.filePath) {
        console.log("File uploaded successfully:", response.data.filePath);

        let messageData = {
          sender: user._id,
          content: undefined,
          messageType: "file",
          fileUrl: response.data.filePath,
        };

        if (selectedchatType === "contact") {
          messageData.recipient = selectedChatData._id;
          socket.emit("sendMessage", messageData);
        } else if (selectedchatType === "channel") {
          messageData.channelId = selectedChannelData._id;
          socket.emit("send-channel-message", messageData);
        }
      }
    } catch (error) {
      console.error(
        "Error in file uploading:",
        error.response?.data || error.message
      );
    }
  }; // ✅ Properly closed function

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[12vh] bg-[#1c1d25] flex justify-center items-center px-6 mb-6">
      <div className="relative w-full max-w-3xl flex bg-[#2a2b33] rounded-full items-center gap-3 px-6 py-4 shadow-lg border border-gray-600">
        <button
          className="transition-all duration-300 text-neutral-400 hover:text-white focus:outline-none"
          onClick={handleFileAttacment}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <Input
          type="file"
          className="hidden"
          ref={fileref}
          onChange={handleAttacmentChange}
        />
        <input
          value={message}
          type="text"
          className="flex-1 text-lg text-white placeholder-gray-400 bg-transparent outline-none"
          placeholder="Type Your Message..."
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="relative transition-all duration-300 text-neutral-400 hover:text-white focus:outline-none"
          onClick={() => setEmojiPicker((prev) => !prev)}
        >
          <RiEmojiStickerLine className="text-2xl" ref={fileref} />
        </button>

        {emojiPicker && (
          <div
            ref={emojiRef}
            className="absolute bottom-[60px] right-14 z-50 bg-[#2a2b33] p-2 rounded-lg shadow-md"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={(emojiObject) =>
                setMessage((msg) => msg + emojiObject.emoji)
              }
            />
          </div>
        )}

        <button
          onClick={handleMessage}
          className="p-3 bg-[#8417ff] rounded-full hover:bg-[#6b13cc] transition-all duration-300 shadow-lg focus:outline-none"
        >
          <IoSend className="text-2xl text-white" />
        </button>
      </div>
    </div>
  );
}

export default Messagebar;
