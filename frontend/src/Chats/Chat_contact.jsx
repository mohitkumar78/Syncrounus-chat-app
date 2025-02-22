import React, { useEffect } from "react";
import Logo from "@/Logo";
import Title from "@/Title";
import ProfileInfo from "./ProfileInfo";
import NewDm from "./NewDm";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setDirectContactList } from "../Store/contact-slice";
import ContactList from "./ContactList";
import CreateChannel from "./CreatateChannel/CreateChaneel";
import { setChannel } from "@/Store/channel-slice";
import "./Scroolbar.css";
function Chat_contact() {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.auth);
  const { DirectMessagesContacts } = useSelector((store) => store.contact);
  const { channels } = useSelector((store) => store.channel);

  useEffect(() => {
    const getContact = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getcontacts-for-dm",
          {
            token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
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
          "http://localhost:5000/api/v1/channels/getAllUserChannel",
          {
            token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
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
  }, [dispatch]);

  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r border-[#2f303b] h-screen flex flex-col">
      {/* Logo Section */}
      <div className="px-4 pt-4">
        <Logo />
      </div>

      {/* Direct Messages Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] scrollbar-thin overflow-y-auto">
          <ContactList contacts={DirectMessagesContacts} />
        </div>
      </div>

      {/* Channels Section */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between">
          <Title text="Create Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] scrollbar-thin overflow-y-auto">
          <ContactList contacts={channels} ischannel={true} />
        </div>
      </div>

      {/* Profile Info at Bottom */}
      <div className="mt-auto">
        <ProfileInfo />
      </div>
    </div>
  );
}

export default Chat_contact;
