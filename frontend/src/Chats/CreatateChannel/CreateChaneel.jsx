import React, { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import { addChannel } from "../../Store/channel-slice";

const Dialog = lazy(() =>
  import("@/components/ui/dialog").then((mod) => ({ default: mod.Dialog }))
);
const DialogContent = lazy(() =>
  import("@/components/ui/dialog").then((mod) => ({
    default: mod.DialogContent,
  }))
);
const DialogHeader = lazy(() =>
  import("@/components/ui/dialog").then((mod) => ({
    default: mod.DialogHeader,
  }))
);
const DialogTitle = lazy(() =>
  import("@/components/ui/dialog").then((mod) => ({ default: mod.DialogTitle }))
);
const TooltipProvider = lazy(() =>
  import("@/components/ui/tooltip").then((mod) => ({
    default: mod.TooltipProvider,
  }))
);
const Tooltip = lazy(() =>
  import("@/components/ui/tooltip").then((mod) => ({ default: mod.Tooltip }))
);
const TooltipTrigger = lazy(() =>
  import("@/components/ui/tooltip").then((mod) => ({
    default: mod.TooltipTrigger,
  }))
);
const TooltipContent = lazy(() =>
  import("@/components/ui/tooltip").then((mod) => ({
    default: mod.TooltipContent,
  }))
);
const Select = lazy(() => import("react-select"));
const Input = lazy(() => import("@/components/ui/input"));
const Button = lazy(() => import("@/components/ui/button"));

function CreateChannel() {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.auth);
  const [openNewChannelModel, setOpenNewChannelModel] = useState(false);
  const [allOptions, setAllOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getAllContact = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/getAllContact",
          { token },
          { headers: { "Content-Type": "application/json" } }
        );
        setAllOptions(response.data.contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    getAllContact();
  }, [token]);

  const createChannel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/channels/channel",
        {
          name: channelName,
          members: selectedOptions.map((opt) => opt.value),
          token,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response) {
        setAllOptions([]);
        setSelectedOptions([]);
        setChannelName("");
        dispatch(addChannel({ Channel: response.data.Channel }));
        setOpenNewChannelModel(false);
      }
    } catch (error) {
      console.log("Error creating a channel", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="transition-transform transform cursor-pointer hover:scale-125 text-neutral-400 hover:text-white"
                onClick={() => setOpenNewChannelModel(true)}
                size={20}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3 shadow-lg rounded-md">
              Create New Channel
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog
          open={openNewChannelModel}
          onOpenChange={setOpenNewChannelModel}
        >
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[500px] flex flex-col p-6 rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Create a Channel
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <Input
                placeholder="Enter Channel Name"
                className="w-full rounded-lg px-4 py-3 border border-gray-600 bg-[#2c2b3e] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
            </div>

            <div className="mt-4">
              <Select
                options={allOptions}
                isMulti
                value={selectedOptions}
                onChange={setSelectedOptions}
                placeholder="Select contacts..."
              />
            </div>

            <div className="mt-4">
              {selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-between px-3 py-2 mb-2 text-white bg-gray-900 rounded-md"
                >
                  <span>{option.label}</span>
                  <FaTimes
                    className="text-red-400 cursor-pointer hover:text-red-600"
                    onClick={() =>
                      setSelectedOptions(
                        selectedOptions.filter(
                          (opt) => opt.value !== option.value
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                className="w-full py-3 text-lg font-semibold text-white bg-purple-700 rounded-lg hover:bg-purple-600"
                onClick={createChannel}
              >
                Create Channel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  );
}

export default CreateChannel;
