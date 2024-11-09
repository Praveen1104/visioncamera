import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { baseURL } from "../Util/AxiosInstance";
import { TiLocation } from "react-icons/ti";
import { GiCctvCamera } from "react-icons/gi";
import CameraDashboardCard from "../components/CameraDashboardCard";
import { IoArrowBackOutline } from "react-icons/io5";

const UserCameraDetails = () => {
  const { visionXId } = useParams();
  const navigate = useNavigate();
  const [cameraData, setCameraData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const getKitData = async () => {
    try {
      const response = await axios.get(`/kit/get-kit/${visionXId}`);
      setCameraData(response.data.response.cameraStatuses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKitData();
  }, []);

  setInterval(() => {
    getKitData();
  }, 3000);

  // useEffect(() => {
  //   getKitData();
  //   const ws = new WebSocket(baseURL); // Corrected WebSocket URL

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     getKitData();
  //   };
  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, [visionXId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  const filteredCameras = cameraData.filter((item) => {
    const matchesSearch =
      item.cameraPosition?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item.ip?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div>
        <button
          onClick={() => navigate(-1)}
          className="border-2 border-white rounded-full p-2 m-4 mb-0"
        >
          <IoArrowBackOutline className="w-4 h-4 text-white" />
        </button>
        {/* Camera Info's Dashboard */}
        {/* <CameraDashboardCard cameraData={cameraData} /> */}
      </div>

      <div className="flex gap-4 p-4 max-sm:flex-col">
        <input
          type="text"
          className="bg-gray-700 text-white p-2 rounded-lg"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex gap-4 max-sm:flex-col max-sm:w-full">
          <button
            className={`rounded-md w-fit px-4 capitalize font-semibold max-sm:w-full ${
              activeFilter === "all"
                ? "bg-slate-300 text-gray-950"
                : "bg-gray-700"
            }`}
            onClick={() => handleFilter("all")}
          >
            all
          </button>
          <button
            className={`rounded-md w-fit px-2 capitalize font-semibold max-sm:w-full ${
              activeFilter === "Online"
                ? "bg-slate-300 text-gray-950"
                : "bg-green-600"
            }`}
            onClick={() => handleFilter("Online")}
          >
            active
          </button>
          <button
            className={`rounded-md w-fit px-2 capitalize font-semibold max-sm:w-full ${
              activeFilter === "Offline"
                ? "bg-slate-300 text-gray-950"
                : "bg-red-600"
            }`}
            onClick={() => handleFilter("Offline")}
          >
            inactive
          </button>
        </div>
      </div>

      <div className="w-full flex gap-4 flex-wrap p-4">
        {filteredCameras.map((item, i) => (
          <div
            key={i}
            className="min-w-52 space-y-4 shadow-lg rounded-lg p-4 border border-gray-800 bg-gray-800 backdrop-blur-md transition-all duration-300 hover:scale-105"
          >
            <div className="flex justify-between capitalize items-center">
              <TiLocation size={25} className="text-red-500 animate-bounce" />
              <h1 className="text-lg font-semibold text-gray-100">
                {item?.cameraPosition}
              </h1>
            </div>
            <div className="flex justify-between items-center gap-2">
              <GiCctvCamera
                size={25}
                className="text-yellow-500 animate-pulse"
              />
              <h1 className="text-sm text-gray-100">{item?.ip}</h1>
            </div>

            <div className="flex justify-center">
              <h1
                className={`text-sm text-center w-fit px-2 py-1 rounded-full font-medium ${
                  item.status === "Active" || item.status === "Online"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {item.status}
              </h1>
            </div>
            <div
              className={`flex justify-center text-center w-full px-2 py-0 text-sm rounded-full`}
            >
              <h1
                className={`w-fit px-2 py-1 rounded-full font-medium ${
                  item?.Coverage === "Screen is interrupted" ||
                  item?.Coverage === "None" ||
                  item?.Coverage === "Error"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              >
                {item?.Coverage}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCameraDetails;
