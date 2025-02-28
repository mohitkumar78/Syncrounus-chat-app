import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSelectedChat } from "../Store/contact-slice";
import { clearChatContainer } from "../Store/contact-slice";
import { setSelectedChannelChat } from "../Store/channel-slice";
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const { selectedchatType, selectedChatData } = useSelector(
    (store) => store.contact
  );
  const { selectedChannelData } = useSelector((store) => store.channel);
  // Create refs to always store the latest state
  const selectedChatDataRef = useRef(selectedChatData);
  const selectedchatTypeRef = useRef(selectedchatType);

  const selectedChannelDataRef = useRef(selectedChannelData);
  // Update the refs whenever state changes
  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
    selectedchatTypeRef.current = selectedchatType;
    selectedChannelDataRef.current = selectedChannelData;
  }, [selectedChatData, selectedchatType, selectedChannelData]);

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io("https://syncrounus-chat-app-1.onrender.com", {
        withCredentials: true,
        query: { userId: user._id },
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Connected to socket server:", socketRef.current.id);
      });

      socketRef.current.on("receiveMessage", (message) => {
        // Use refs to get the latest state values
        const latestSelectedChatData = selectedChatDataRef.current;
        const latestSelectedChatType = selectedchatTypeRef.current;

        console.log(latestSelectedChatData);
        console.log(latestSelectedChatType);

        if (
          latestSelectedChatType === "contact" &&
          (latestSelectedChatData?._id === message.sender._id ||
            latestSelectedChatData?._id === message.recipient._id)
        ) {
          console.log("📌 Storing message");
          dispatch(setSelectedChat({ message }));
        }
      });
      socketRef.current.on("recive-channel-msg", (message) => {
        dispatch(clearChatContainer());
        const latestSelectedChannelData = selectedChannelDataRef.current;
        const latestSelectedChatType = selectedchatTypeRef.current;
        if (
          latestSelectedChatType === "channel" &&
          latestSelectedChannelData?._id === message.channelId
        ) {
          console.log("📌 Storing message");
          dispatch(setSelectedChannelChat({ message }));
        }
      });
      socketRef.current.on("disconnect", () => {
        console.log("⚠️ Socket disconnected. Reconnecting...");
        socketRef.current.connect();
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
