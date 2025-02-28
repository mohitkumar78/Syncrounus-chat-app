import React from "react";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { getColor } from "@/Utils/Utils";
import { useNavigate } from "react-router-dom";
import {
  TooltipProvider,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { logout } from "../Store/auth-slice.js";

function ProfileInfo() {
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debugging user data

  // Ensure user exists before rendering
  if (!user) return null;

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-6 w-full bg-[#212b33] shadow-lg">
      {/* Avatar Section */}
      <div className="flex items-center gap-3">
        <Avatar className="w-14 h-14 rounded-full shadow-md border-4 border-[#f03a17] flex items-center justify-center bg-gray-700 overflow-hidden">
          {user?.image ? (
            <AvatarImage
              src={user.image}
              alt="profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className={`flex items-center justify-center w-full h-full text-white font-semibold text-base leading-tight ${getColor(
                user?.color
              )}`}
            >
              {user?.firstname?.charAt(0) || ""}{" "}
              {user?.lastname?.charAt(0) || ""}
            </div>
          )}
        </Avatar>
        <div className="w-32 text-base font-medium text-white truncate">
          {user?.firstname} {user?.lastname}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {/* Edit Profile */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-xl font-medium text-purple-500 transition duration-200 cursor-pointer hover:text-purple-400"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Logout */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-xl font-medium text-red-600 transition duration-200 cursor-pointer hover:text-red-400"
                onClick={() => {
                  dispatch(logout()); // Fixed typo
                  navigate("/auth"); // Redirect to login page after logout
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
