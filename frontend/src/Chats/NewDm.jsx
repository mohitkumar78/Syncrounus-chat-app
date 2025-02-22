import React, { useState } from "react";
import Lottie from "react-lottie";
import { animationDefaultOption } from "../Utils/Utils.js";
import { useDispatch } from "react-redux";
import { getColor } from "../Utils/Utils.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "../components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import { ScrollArea } from "../components/ui/scroll-area.jsx";
import { setChatType, setSelectedChatData } from "@/Store/contact-slice.js";
function NewDm() {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.auth);
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContact, setSearchContact] = useState([]);
  const selectedContact = (contact) => {
    console.log(contact);
    if (!contact) return;
    dispatch(setChatType({ chatType: "contact" }));
    dispatch(setSelectedChatData({ contact }));

    setOpenNewContactModel(false); // Close dialog
    setSearchContact([]);
  };
  const SearchContacts = async (searchTerm) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/contact",
        {
          token,
          searchTerm,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setSearchContact(response.data.contacts);
      }
    } catch (error) {
      console.log("error is occur in search contact", error);
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="transition-transform transform cursor-pointer hover:scale-110 text-neutral-400 hover:text-white"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3 shadow-lg">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[450px] flex flex-col p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Please Select Contact
            </DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="mt-4">
            <Input
              placeholder="Search Contact"
              className="w-full rounded-lg px-4 py-3 border border-[#2c2b3e] bg-[#2c2b3e] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              onChange={(e) => SearchContacts(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[250px] mt-3 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {searchContact.length > 0 ? (
                searchContact.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#2c2b3e] transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      selectedContact(contact);
                    }}
                  >
                    <Avatar className="w-14 h-14 rounded-full shadow-lg border-4 border-[#f03a17] flex items-center justify-center bg-gray-700 overflow-hidden">
                      {contact?.image ? (
                        <AvatarImage
                          src={contact.image}
                          alt="profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className={`flex items-center justify-center w-full h-full text-white font-semibold text-base leading-tight ${getColor(
                            contact?.color
                          )}`}
                        >
                          {contact?.firstname?.charAt(0) || ""}{" "}
                          {contact?.lastname?.charAt(0) || ""}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col text-white">
                      <span className="text-lg font-medium">
                        {contact?.firstname} {contact?.lastname}
                      </span>
                      <span className="text-sm text-gray-400">
                        {contact?.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 transition-opacity duration-500">
                  <Lottie
                    isClickToPauseDisabled={true}
                    height={180}
                    width={180}
                    options={animationDefaultOption}
                  />
                  <div className="mt-4 text-xl text-center text-white text-opacity-80">
                    <h3 className="font-medium">
                      Hi <span className="text-purple-500">!</span> Search New{" "}
                      <span className="text-purple-500">Contacts.</span>
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewDm;
