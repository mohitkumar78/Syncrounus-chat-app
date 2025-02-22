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
      "http://localhost:4000/api/v1/message/getAllmessage",
      {
        token,
        recipient: selectedChatData?._id,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.messages) {
      console.log("Fetched messages:", response.data.messages);
      dispatch(setSelectedChat({ message: response.data.messages })); // ✅ Send full array
    }
  } catch (error) {
    console.log("Error in fetching message history:", error);
  }
};
