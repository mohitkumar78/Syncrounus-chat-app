import { setSelectedChat } from "../Store/contact-slice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
export const getAllMessage = async () => {
  const { selectedChatData } = useSelector((store) => store.contact);
  const { token } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  console.log("get all message call");
  try {
    const response = await axios.post(
      "https://syncrounus-chat-app-1.onrender.com/api/v1/message/getAllmessage",
      {
        token,
        recipient: selectedChatData?._id,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.messages) {
      dispatch(setSelectedChat({ message: response.data.messages })); // ✅ Send full array
    }
  } catch (error) {
    console.log("Error in fetching message history:", error);
  }
};
