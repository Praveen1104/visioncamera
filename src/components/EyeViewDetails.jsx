import React from "react";
import background from "../assets/background.jpg";
import CustTable from "./CustTable";
import MonitoringArea from "./MonitoringArea";
import EnlargeView from "./EnlargeView";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

function EyeViewDetails() {
  return (
    <div
      className="min-h-screen min-w-screen flex flex-col bg-zinc-900 text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Link to="/dashboard">
        <FaArrowLeft className="bg-[#26292e] text-white text-3xl p-2 rounded-full m-5 mb-0 cursor-pointer" />
      </Link>
      <CustTable />
      <h2 className="text-2xl ml-5 my-2">Monitoring Areas</h2>
      <MonitoringArea />
      <EnlargeView />
    </div>
  );
}

export default EyeViewDetails;
