import React, { useState, Suspense } from "react";
import { toast } from "sonner";
import axios from "axios";

// Directly import the UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { email, password, confirmPassword } = formData;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (confirmPassword !== password) {
      toast.error("Password and Confirm Password must match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res) {
        toast.success(res.data.message || "Signup successful");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error during signup");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col items-center space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full px-6 py-3 rounded-full"
          value={email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="w-full px-6 py-3 rounded-full"
          value={password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className="w-full px-6 py-3 rounded-full"
          value={confirmPassword}
          onChange={handleChange}
        />
        <Button
          type="submit"
          className="w-full py-3 text-white bg-purple-600 rounded-full"
        >
          Signup
        </Button>
      </div>
    </form>
  );
}

export default Signup;
