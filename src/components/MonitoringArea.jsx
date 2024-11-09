import React, { useState, useEffect } from "react";
import EnlargeView from "./EnlargeView";
import KitTable from "./KitTable";
import { useParams } from "react-router-dom";
import axios from "../Util/AxiosInstance";
import { baseURL } from "../Util/AxiosInstance";
function MonitoringArea() {
  const { customerId } = useParams();
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [kitData, setKitData] = useState([]);

  const handleCardClick = (cameraId) => {
    const selected = kitData.find((data) => data.visionXId === cameraId);
    setSelectedCamera(selected); // Store the entire selected object
  };

  const kitsDetails = async () => {
    try {
      const response = await axios.get(`/kit/get-kits/${customerId}`);
      setKitData(response.data.response);
    } catch (error) {
      console.log("Error fetching kits:", error);
    }
  };

  useEffect(() => {
    kitsDetails();

    const ws = new WebSocket(baseURL); // Corrected WebSocket URL

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      kitsDetails(); // Fetch updated kit details
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [customerId]);

  return (
    <div className="w-full p-4 gap-5 flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kitData.map((data, key) => (
          <div key={key} onClick={() => handleCardClick(data.visionXId)}>
            <div className="bg-[--input-bg-color] flex flex-col gap-5 rounded-xl shadow-md p-4 cursor-pointer text-center">
              <div className="bg-[#26292e] p-2 rounded-xl flex items-center justify-between">
                <p>{data.visionXId}</p>
                <span
                  className={`w-3 h-3 rounded-full ${
                    // If any status is not "Online" or "Active", show red
                    data.cameraStatuses.some(
                      (status) =>
                        status.status !== "Online" && status.status !== "Active" || status.Coverage === "Screen is interrupted" || status.Coverage === "None" || status.Coverage === "Error"
                    )
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                ></span>
              </div>

              <div className="flex flex-row w-full justify-evenly items-center gap-5">
                {/* Location Field */}
                <div className="border border-[--border-color] rounded-xl w-full overflow-hidden">
                  <p className="w-full flex items-center justify-center bg-[#26292e]">
                    Location
                  </p>
                  <p className="w-full flex items-center justify-center font-semibold">
                    {data.location}
                  </p>
                </div>

                {/* No. Of Cameras Field */}
                <div className="border border-[--border-color] rounded-xl w-full overflow-hidden">
                  <p className="w-full flex items-center justify-center bg-[#26292e]">
                    No. Of Cameras
                  </p>
                  <div className="flex items-center justify-center font-semibold">
                    {data.cameraStatuses.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedCamera && (
        <>
          <KitTable kitid={selectedCamera.visionXId} />
          
          {/* {selectedCamera.images && (
            <div className="mt-8">
              <EnlargeView images={selectedCamera.images} />
            </div>
          )} */}
        </>
      )}
    </div>
  );
}

export default MonitoringArea;
