import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/Login.css";
import img from "../assets/loginSideImg.svg";
import loginXlogo from "../assets/loginXlogo.svg";
import companyLogo from "../assets/companyLogo.png";
import axiosInstance from "../Util/AxiosInstance";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (email === "visionx@qsis.com" && password === "admin") {
        const response = await axiosInstance.post("/admin/admin-login", {
          email,
          password,
        });

        toast.success(response.data.message || "Admin Login Successfully");
        localStorage.setItem(
          "Credentials",
          JSON.stringify(response.data.response)
        );
        console.log(response);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        const response = await axiosInstance.post("/customer/login", {
          customerId: email,
          password,
        });

        console.log(response);
        toast.success(response.data.message || "Login Successfully");
        localStorage.setItem(
          "Credentials",
          JSON.stringify(response.data.response)
        );
        setTimeout(() => {
          navigate("/user");
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
      error?.response?.data?.message || "Login failed. Please try again.";
      
      console.log(error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full flex flex-row items-center min-h-screen justify-center text-[#444444]">
      <Toaster />
      <div className="w-1/2 max-lg:hidden h-screen flex items-center justify-center bg-[#1A4D8F]">
        <img src={img} alt="" />
      </div>
      <div className="w-1/2 h-screen max-lg:justify-start max-lg:w-full max-lg:h-full flex flex-col gap-10 items-center justify-center bg-white">
        <div className="w-full flex flex-col items-center justify-center gap-5">
          <img src={loginXlogo} alt="" />
          <p className=" text-2xl w-1/2 text-wrap text-center">
            Welcome back! Please login to your Quantum VisionX account
          </p>
        </div>
        <form className="flex flex-col gap-10 w-1/2 items-center">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-3 border-2 rounded-full border[--border-color] bg-[#FBFBFB]"
              required
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-3 border-2 rounded-full border[--border-color] bg-[#FBFBFB]"
              required
            />
          </div>
          <div className="flex flex-col gap-2 w-full items-center">
            <button
              onClick={handleLogin}
              className="bg-[#1a4d8f] text-white px-20 py-3 text w-fit"
            >
              LOGIN
            </button>
            <a href="#">
              <p>Forgot Password?</p>
            </a>
          </div>
        </form>
        <div className="flex flex-col gap-2 items-center">
          <p>from</p>
          <img src={companyLogo} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;
