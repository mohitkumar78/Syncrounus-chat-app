import React, { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setDirectContactList } from "../Store/contact-slice";
import { setChannel } from "@/Store/channel-slice";
import "./Scroolbar.css";

// Lazy load components
const Logo = lazy(() => import("@/Logo"));
const Title = lazy(() => import("@/Title"));
const ProfileInfo = lazy(() => import("./ProfileInfo"));
const NewDm = lazy(() => import("./NewDm"));
const ContactList = lazy(() => import("./ContactList"));
const CreateChannel = lazy(() => import("./CreatateChannel/CreateChaneel"));

function Chat_contact() {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.auth);
  const { DirectMessagesContacts } = useSelector((store) => store.contact);
  const { channels } = useSelector((store) => store.channel);

  useEffect(() => {
    const getContact = async () => {
      try {
        const response = await axios.post(
          "https://syncrounus-chat-app-1.onrender.com/api/v1/users/getcontacts-for-dm",
          { token },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response) {
          dispatch(setDirectContactList({ contacts: response.data.contacts }));
        }
      } catch (error) {
        console.log("error in chat_contact", error);
      }
    };

    const getAllUserChannel = async () => {
      try {
        const response = await axios.post(
          "https://syncrounus-chat-app-1.onrender.com/api/v1/channels/getAllUserChannel",
          { token },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response) {
          dispatch(setChannel({ Channel: response.data.Channels }));
        }
      } catch (error) {
        console.log("Error while fetching all channels");
      }
    };

    getAllUserChannel();
    getContact();
  }, [dispatch, token]);

  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r border-[#2f303b] h-screen flex flex-col">
      {/* Logo Section */}
      <div className="px-4 pt-4">
        <Suspense fallback={<div>Loading Logo...</div>}>
          <Logo />
        </Suspense>
      </div>

      {/* Direct Messages Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between">
          <Suspense fallback={<div>Loading Title...</div>}>
            <Title text="Direct Messages" />
          </Suspense>
          <Suspense fallback={<div>Loading New DM...</div>}>
            <NewDm />
          </Suspense>
        </div>
        <div className="max-h-[38vh] scrollbar-thin overflow-y-auto">
          <Suspense fallback={<div>Loading Contacts...</div>}>
            <ContactList contacts={DirectMessagesContacts} />
          </Suspense>
        </div>
      </div>

      {/* Channels Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between">
          <Suspense fallback={<div>Loading Title...</div>}>
            <Title text="Create Channels" />
          </Suspense>
          <Suspense fallback={<div>Loading Create Channel...</div>}>
            <CreateChannel />
          </Suspense>
        </div>
        <div className="max-h-[38vh] scrollbar-thin overflow-y-auto">
          <Suspense fallback={<div>Loading Channels...</div>}>
            <ContactList contacts={channels} ischannel={true} />
          </Suspense>
        </div>
      </div>

      {/* Profile Info at Bottom */}
      <div className="mt-auto">
        <Suspense fallback={<div>Loading Profile...</div>}>
          <ProfileInfo />
        </Suspense>
      </div>
    </div>
  );
}

export default Chat_contact;
