// CameraDetailsTable.js

import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import axios from "../Util/AxiosInstance";

const CameraDetailsTable = ({ camData }) => {
  const [cameraData, setCameraData] = useState([]);
  const [visionXIds, setVisionxids] = useState([]); //
  const getKitData = async () => {
    try {
      const response = await axios.get(`/kit/get-kit/${visionXIds}`);
      setCameraData(response.data.response.cameraStatuses);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getKitData();
    setVisionxids(camData?.visionXId);
    // setInterval(() => {
    //   getKitData();
    // }, 3000);
  }, [camData]);

  if (!camData) return null; // Don't render if no data is passed
  console.log(camData);
  // Define table columns
  const columns = [
    {
      title: <span className="font-bold text-lg">IP Address</span>,
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (text) => <span className="text-lg">{text}</span>,
    },
    {
      title: <span className="font-bold text-lg">Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "Online" ? "green" : "volcano"}
          className="text-lg"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: <span className="font-bold text-lg">Coverage</span>,
      dataIndex: "coverage",
      key: "coverage",
      render: (coverage) => (
        <Tag
          color={coverage === "Screen not interrupted" ? "green" : "volcano"}
          className="text-lg"
        >
          {coverage}
        </Tag>
      ),
    },
    {
      title: <span className="font-bold text-lg">Position</span>,
      dataIndex: "position",
      key: "position",
      render: (position) => <span className="text-lg">{position}</span>,
    },
  ];

  // Transform camera data for table format
  const data = cameraData?.cameraStatuses?.map((camera, index) => ({
    key: index,
    ipAddress: camera.ip,
    status: camera.status,
    coverage: camera.Coverage,
    position: camera.cameraPosition,
  }));

  return (
    <div className="mt-6 p-4 bg-cardColor rounded-xl shadow-lg">
      {/* Summary section for VisionX ID, Location, and Camera Count */}
      <div className="mb-4 p-4 bg-gray-700 rounded-lg text-white flex justify-between items-center">
        <p className="text-lg font-semibold">
          <strong>VisionX ID:</strong> {cameraData?.visionXId}
        </p>
        <p className="text-lg font-semibold">
          <strong>Location:</strong> {cameraData?.location}
        </p>
        <p className="text-lg font-semibold">
          <strong>No. of Cameras:</strong> {cameraData?.cameraStatuses?.length}
        </p>
      </div>

      {/* Table for camera statuses */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 150 }}
        className="text-lg"
        style={{ fontWeight: "bold" }}
      />
    </div>
  );
};

export default CameraDetailsTable;
