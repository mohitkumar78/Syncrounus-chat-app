import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../Store/auth-slice.js";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res) {
        toast.success(res.data.message || "Login successful");
        dispatch(setUser({ user: res.data.user, token: res.data.token }));
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error during login");
    }
  };

  return (
    <div>
      <form onSubmit={loginHandler}>
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
          <Button
            type="submit"
            className="w-full py-3 text-white bg-purple-600 rounded-full"
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
