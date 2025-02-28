import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { getColor } from "@/Utils/Utils";
import { Input } from "@/components/ui/input";
import { colors } from "../Utils/Utils.js";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../Store/auth-slice";
import axios from "axios";

function Profile() {
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Fixed typo
  const [selectedColor, setSelectedColor] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const color = getColor(selectedColor);
  const { user, token } = useSelector((store) => store.auth);
  const naviagte = useNavigate();
  console.log(token);
  console.log(user);
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dcmtnw3ko/image/upload";
  const UPLOAD_PRESET = "chatapp";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://syncrounus-chat-app-1.onrender.com/api/v1/user/getInfo",
        {
          firstName,
          lastName,
          color,
          image: uploadedImageUrl,
          profileSetup: true,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json", // Fixed header
          },
        }
      );
      if (response.data) {
        dispatch(updateUser({ user: response.data.user }));
        naviagte("/chat");
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error occurred while updating user:", error.message);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setUploadedImageUrl(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1b1c24] via-[#2c2f3f] to-[#1b1c24] flex items-center justify-center p-5">
      <div className="w-full max-w-xl p-8 rounded-lg shadow-lg">
        {/* Back Button */}
        <div className="flex justify-start mb-6">
          <IoArrowBack className="text-3xl cursor-pointer text-white hover:text-[#f03a17] transition-colors" />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-12 md:flex-row">
          {/* Avatar Section */}
          <div
            className="relative flex-shrink-0 w-40 h-40 md:w-48 md:h-48"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar className="w-full h-full rounded-full shadow-md border-4 border-[#f03a17] overflow-hidden">
              {uploadedImageUrl ? (
                <AvatarImage
                  src={uploadedImageUrl}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`flex items-center justify-center h-full w-full text-5xl font-bold text-white ${getColor(
                    selectedColor
                  )}`}
                >
                  {user?.email?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </Avatar>
            {hover && (
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white rounded-full bg-black/50">
                Change Photo
              </div>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
          </div>

          {/* User Details Form */}
          <div className="w-full">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter Your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 bg-[#1b1c24] text-white border-[#3d3f4c]"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter Your Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)} // Fixed typo
                  className="mt-1 bg-[#1b1c24] text-white border-[#3d3f4c]"
                />
              </div>
              <div className="flex w-full gap-5">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                      selectedColor === index
                        ? "outline outline-1 outline-white"
                        : ""
                    }`}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
              <Button
                type="submit"
                className={`${getColor(selectedColor)} w-full mt-12`}
              >
                Complete Your Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
