import React from "react";
import quantum from "../assets/Quantum-Q.png";
import "../styles/App.css";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  // Retrieve admin data from local storage and parse JSON
  const getLocalStorageData = localStorage.getItem("Credentials");
  const localStorageDataJSON = JSON.parse(getLocalStorageData);

  // Logout function to remove admin data from local storage
  const handleLogout = () => {
    localStorage.removeItem("Credentials");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 navbar h-[10vh] flex">
        <Toaster />
        <div className="flex max-sm:flex-row justify-between w-full items-center">
          <a className="flex items-center">
            <img src={quantum} className="mr-3 h-10" alt="cctv" />
            <h2 className="text-gray-800 font-semibold whitespace-nowrap text-2xl max-md:hidden">
              Quantum Sharq Innovative Solutions
            </h2>
            <h2 className="hidden max-md:flex text-black text-xl font-bold">
              QSIS
            </h2>
          </a>

          <div className="flex flex-row items-center justify-center">
            {/* <img
              src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG.png"
              className="h-6"
              alt="user"
            /> */}
            <a
              href="#"
              className="text-[#1b1c1e] hover:bg-gray-50 focus:ring-4 font-medium text-xl max-sm:text-sm rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2  "
            >
              Welcome, {localStorageDataJSON.name || "User"}
            </a>
            <div
              className=" text-gray-500 bg-gray-100 px-2 py-1 border rounded-lg border-gray-500 cursor-pointer"
              title="Logout"
              onClick={handleLogout}
            >
              <i>
                <FiLogOut size={20} />
              </i>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
