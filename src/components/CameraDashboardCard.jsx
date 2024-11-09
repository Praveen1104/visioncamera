import React, { useState } from "react";
import { Modal, Button } from "antd";
import { GiCctvCamera } from "react-icons/gi";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";
import { MdWarning } from "react-icons/md";

const CameraDashboardCard = ({ kitData }) => {
  console.log(kitData);
  const totalCameras = kitData.flatMap((entry) => entry.cameraStatuses);
  const totalCamerasCount = totalCameras.length;
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Active camera count
  const activeCameras = kitData.flatMap((entry) =>
    entry.cameraStatuses.filter((camera) => camera.status === "Online")
  );
  // Inactive camera count
  const inactiveCameras = kitData.flatMap((entry) =>
    entry.cameraStatuses.filter((camera) => camera.status === "Offline")
  );
  // Issues camera count (disconnected/interrupted)
  const issuesCameras = kitData.flatMap((entry) =>
    entry.cameraStatuses.filter(
      (camera) =>
        camera.Coverage === "None" ||
        camera.Coverage === "Screen is interrupted" ||
        camera.Coverage === "Error"
    )
  );

  return (
    <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 grid-cols-4 gap-4 p-4">
      <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Total Cameras
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <GiCctvCamera size={35} className="text-blue-600 animate-pulse" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {totalCamerasCount || 0}
          </p>
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-green-800 mb-3">
          Active Cameras
        </h2>

        <div className="flex items-center justify-between">
          <HiStatusOnline size={35} className="text-green-600 animate-pulse" />
          <p className="text-3xl font-bold text-green-600">
            {activeCameras.length || 0}
          </p>
        </div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-yellow-800 mb-3">
          Live Cameras
        </h2>
        <div className="flex items-center justify-between">
          <HiStatusOffline
            size={35}
            className="text-yellow-600 animate-pulse"
          />
          <p className="text-3xl font-bold text-yellow-600">
            {inactiveCameras.length || 0}
          </p>
        </div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-red-800 mb-3">
        Camera Interrupted
        </h2>
        {issuesCameras.length > 0 ? (
          <div className="flex items-center justify-between">
            <MdWarning size={35} className="text-red-600 animate-pulse" />
            <p className="text-3xl font-bold text-red-600">
              {issuesCameras.length}
            </p>
            <button
              onClick={handleOpenDialog}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
            >
              View
            </button>
          </div>
        ) : (
          <p className="text-sm text-red-600">No issues detected.</p>
        )}
      </div>
      <Modal
        title="Cameras with Issues"
        open={openDialog}
        onCancel={handleCloseDialog}
        footer={[
          <Button key="close" onClick={handleCloseDialog}>
            Close
          </Button>,
        ]}
      >
        {issuesCameras.map((camera, i) => (
          <div
            key={i}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow flex justify-between"
          >
            <div>
              <p className="mb-1">
                <span className="font-medium">Location:</span>
                <span className="font-semibold text-lg ml-2">
                  {camera.cameraPosition}
                </span>
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`font-bold ${
                    camera.status === "Offline" || camera.status === false || camera.status === "false"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {camera.status}
                </span>
              </p>
              <p className="mb-1 capitalize">
                <span className="font-medium">Coverage:</span>{" "}
                <span
                  className={`font-medium ${
                    camera.Coverage === "None" ||
                    camera.Coverage === "Screen is interrupted" ||
                    camera.Coverage === "Error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {camera.Coverage ?? "Offline"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">
                <span className="font-medium">IP:</span> {camera.ip}
              </p>
            </div>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default CameraDashboardCard;
