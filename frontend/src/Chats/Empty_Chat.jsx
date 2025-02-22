import Lottie from "react-lottie";
import React from "react";
import { animationDefaultOption } from "../Utils/Utils.js";

function Empty_Chat() {
  return (
    <div className="flex-1 bg-[#1c1d25] flex flex-col justify-center items-center transition-opacity duration-500 md:flex hidden">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOption}
      />
      <div className="flex flex-col items-center gap-5 mt-10 text-3xl text-center text-white transition-all duration-300 text-opacity-80 lg:text-4xl">
        <h3 className="poppins-medium">
          Hii <span className="text-purple-500">!</span> Welcome to{" "}
          <span className="text-purple-500">Syncronus</span>Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
}

export default Empty_Chat;
