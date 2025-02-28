import React from "react";
import vectory from "../assets/victory.svg";
import login from "../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "./Login";
import Signup from "./Signup";

function Auth() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="h-[90vh] w-[95vw] md:w-[80vw] xl:w-[70vw] rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col md:flex-row items-center p-6 md:p-8">
        {/* Left Section */}
        <div className="flex flex-col items-center justify-center w-full space-y-6 text-white md:w-1/2">
          {/* Header Section */}
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center space-x-3">
              <h1 className="text-5xl font-extrabold tracking-wide md:text-6xl text-[#f9a826]">
                Welcome
              </h1>
              <img
                src={vectory}
                alt="vectory emoji"
                className="h-[50px] md:h-[80px] animate-bounce"
              />
            </div>
            <p className="mt-2 font-medium text-gray-300">
              Get started with the best chat experience now.
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="signup" className="w-full">
            {/* Tab List */}
            <TabsList className="flex justify-center mb-6 space-x-12 bg-transparent rounded-none">
              <TabsTrigger
                value="login"
                className="px-6 py-2 text-lg font-semibold text-gray-300 transition-all duration-300 hover:text-[#f9a826] data-[state=active]:text-[#f9a826] data-[state=active]:font-bold border-b-2 border-transparent data-[state=active]:border-[#f9a826]"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="px-6 py-2 text-lg font-semibold text-gray-300 transition-all duration-300 hover:text-[#f9a826] data-[state=active]:text-[#f9a826] data-[state=active]:font-bold border-b-2 border-transparent data-[state=active]:border-[#f9a826]"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Login Tab Content */}
            <TabsContent
              value="login"
              className="data-[state=active]:block hidden transition-all duration-300"
            >
              <Login />
            </TabsContent>

            {/* Signup Tab Content */}
            <TabsContent
              value="signup"
              className="data-[state=active]:block hidden transition-all duration-300"
            >
              <Signup />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Section (Image) */}
        <div className="items-center justify-center hidden w-1/2 h-full md:flex">
          <img
            src={login}
            alt="Login Illustration"
            className="h-[65%] w-auto object-contain drop-shadow-xl animate-fade-in"
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;
