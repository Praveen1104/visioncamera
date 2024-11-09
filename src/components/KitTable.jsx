import React, { useEffect, useState } from "react";
import axios from "../Util/AxiosInstance";
import { baseURL } from "../Util/AxiosInstance";
import { MdDelete } from "react-icons/md";
import { Modal, Button, Input } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";

const KitTable = ({ kitid }) => {
  const [kitData, setKitData] = useState([]);

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [SelectedVisionXId, setSelectedVisionXId] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [addKit, setAddKit] = useState(false);
  const [editData, setEditData] = useState({});
  const [camera, setCamera] = useState({ ip: "", position: "", image: null });
  const [lenOfCamera, setLenOfCamera] = useState(0);
  const getKitById = async () => {
    try {
      const response = await axios.get(`/kit/getbykit/${kitid}`);
      setLenOfCamera(response.data.response.cameraStatuses.length);
      setKitData([response.data.response]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getKitById();

    const ws = new WebSocket(baseURL);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      getKitById(); // Fetch updated kit details
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [kitid]);
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/kit/deletekit/${id}`);
      getKitById();
      setConfirmDeleteVisible(false);
      setInputValue(""); // Reset input value
      toast.success(response.data.message);
    } catch (error) {
      console.log("There was a problem from Delete", error);
    }
  };
  const showConfirmDelete = (visionXId) => {
    setSelectedVisionXId(visionXId);
    setConfirmDeleteVisible(true);
  };
  const handleConfirmDelete = () => {
    if (inputValue === SelectedVisionXId.toString()) {
      handleDelete(SelectedVisionXId);
    } else {
      console.log("ID does not match");
    }
  };
  const handleCancelDelete = () => {
    setConfirmDeleteVisible(false);
    setInputValue(""); // Reset input value
  };
  const showEditModal = (data) => {
    setEditData(data);
    setEditVisible(true);
  };
  const handleEdit = async () => {
    try {
      const response = await axios.patch(
        `/kit/updatekitbyid/${editData.visionXId}`,
        editData
      );
      toast.success(response.data.message);
      setEditVisible(false);
      getKitById();
    } catch (error) {
      console.error("Error updating kit:", error);
      toast.error("Error updating kit");
    }
  };
  const handleAddCamera = async () => {
    const formData = new FormData();

    formData.append("ip", camera.ip);
    formData.append("cameraPosition", camera.position);
    formData.append("visionXId", kitid);

    if (camera.image && camera.image instanceof File) {
      formData.append("cameraImg", camera.image);
    } else {
      toast.error("Please select a valid camera image.");
      return;
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.patch("/kit/addcamera", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      setAddKit(false);
      setCamera({ ip: "", position: "", image: "" }); // Clear camera state
    } catch (error) {
      console.error("Error adding camera:", error);
      toast.error("Error adding camera. Please try again.");
    }
  };

  // const handleAddcamera = async () => {
  //   try {
  //     toast.success(response.data.message);
  //     const response = await axios.patch("/kit/addcamera");
  //     setAddKit(false);
  //   } catch (error) {
  //     console.error("Error updating kit:", error);
  //     toast.error("Error updating kit");
  //   }
  // };
  return (
    <div className="relative overflow-x-auto  w-full">
      {kitData?.map((data, key) => (
        <div key={key} className="flex flex-col gap-5">
          <table className="w-full capitalize text-xl text-white border border-[--border-color] rounded-lg overflow-hidden text-center flex flex-col items-center justify-center">
            <thead className="relative bg-[#26292e] w-full text-center flex items-center justify-center ">
              <tr>
                <td className="py-2 flex items-center justify-center">
                  {data.visionXId}
                  <MdDelete
                    className="absolute right-4 ml-2 cursor-pointer"
                    onClick={() => showConfirmDelete(data.visionXId)}
                  />
                  <FiEdit
                    className="absolute right-12 ml-2 cursor-pointer"
                    onClick={() => showEditModal(data)} // Open edit modal
                  />
                </td>
              </tr>
            </thead>
            <tbody className="w-full max-sm:text-sm">
              <tr className="w-full flex border-b border-[--border-color] max-md:flex-col ">
                <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                  Latitude
                </td>
                <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                  {data?.latitude}
                </td>
              </tr>
              <tr className="w-full flex border-b border-[--border-color] max-md:flex-col">
                <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                  Longitude
                </td>
                <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                  {data?.longitude}
                </td>
              </tr>
              <tr className="w-full flex border-b border-[--border-color] max-md:flex-col">
                <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                  Location
                </td>
                <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                  {data?.location}
                </td>
              </tr>
              <tr className="w-full flex border-b border-[--border-color] max-md:flex-col">
                <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                  numberOfCameras
                </td>
                <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                  {data?.cameraStatuses.length}
                </td>
              </tr>
              {/* <tr className="w-full flex border-b border-[--border-color] max-md:flex-col">
                <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                  vision X Id
                </td>
                <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                  {data?.visionXId}
                </td>
              </tr> */}
            </tbody>
          </table>
          <div className="w-full flex items-center justify-end gap-5">
            <button
              onClick={() => {
                setAddKit(true);
              }}
              className="text-center text-xl mb-4 bg-[--border-color] hover:bg-[--input-bg-color] duration-200 px-4 p-2 rounded"
            >
              Add camera
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {data?.cameraStatuses.map((status, index) => (
              <div
                key={index}
                className={`border border-[--border-color] max-md:w-full rounded-xl backdrop-blur-xl relative p-4 w-[400px] h-fit flex flex-col gap-5 ${
                  status.status === "inactive" &&
                  "flex flex-col items-center justify-center"
                }`}
              >
                <div className="flexing flex flex-row w-full justify-between items-center">
                  <h1 className="max-sm:text-center max-sm:w-full">
                    {status.ip}
                  </h1>
                  <p className="z-20 max-sm:text-center max-sm:w-full">
                    {status.cameraPosition}
                  </p>

                  <div className="flex flex-nowrap h-fit flex-row gap-2 z-20 max-sm:items-center max-sm:justify-center max-sm:w-full">
                    <div
                      className={`flex flex-row gap-2 items-center justify-center px-2 rounded-full border-2 transition duration-300 ${
                        status.status === "Active" || status.status === "Online"
                          ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-green-600 animate-pulse"
                          : "bg-gradient-to-r from-red-400 to-red-600 text-white border-red-600 animate-pulse"
                      }`}
                    >
                      <p>{status.status}</p>
                    </div>
                  </div>
                </div>

                <p
                  className={` capitalize h-fit px-2 text-center rounded-lg font-semibold ${
                    (status.Coverage !== "Screen not interrupted"
                      ? "bg-orange-500"
                      : "bg-green-500") ||
                    status.Coverage === "Error" ||
                    status.Coverage === "None"
                  }`}
                >
                  <span className={``}>{status.Coverage}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Modal
        title={`Add Camera ${kitid}`}
        visible={addKit}
        onCancel={() => setAddKit(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddKit(false)}>
            Cancel
          </Button>,
          <Button key="save" onClick={handleAddCamera} type="primary">
            Save
          </Button>,
        ]}
        width={450}
      >
        <div className="mb-4">
          <div className="grid grid-cols-1 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium">Camera IP</label>
              <Input
                placeholder="Camera IP"
                value={camera.ip}
                onChange={(e) => setCamera({ ...camera, ip: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Camera Position
              </label>
              <Input
                placeholder="Camera Position"
                value={camera.position}
                onChange={(e) =>
                  setCamera({ ...camera, position: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Camera Image</label>
              <Input
                type="file"
                onChange={(e) =>
                  setCamera({ ...camera, image: e.target.files[0] })
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <span className="text-xl font-semibold">{`Edit Kit - ${editData.visionXId}`}</span>
        }
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" onClick={handleEdit} type="primary">
            Save
          </Button>,
        ]}
        width={1000}
        style={{ minWidth: "400px" }}
      >
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium">Latitude</label>
              <Input
                placeholder="Latitude"
                value={editData.latitude}
                onChange={(e) =>
                  setEditData({ ...editData, latitude: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Longitude</label>
              <Input
                placeholder="Longitude"
                value={editData.longitude}
                onChange={(e) =>
                  setEditData({ ...editData, longitude: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <Input
                placeholder="Location"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium">
                Number of Cameras
              </label>
              <Input
                placeholder="Number of Cameras"
                value={editData.numberOfCameras}
                onChange={(e) =>
                  setEditData({ ...editData, numberOfCameras: e.target.value })
                }
              />
            </div> */}
          </div>
        </div>
      </Modal>

      <Modal
        title={`Please confirm the ID to delete the Kit -${SelectedVisionXId}`}
        visible={confirmDeleteVisible}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Cancel
          </Button>,
          <Button
            key="delete"
            onClick={handleConfirmDelete}
            className="bg-red-700"
            danger
          >
            Delete
          </Button>,
        ]}
        width={600}
        style={{ minWidth: "400px" }}
      >
        <Input
          placeholder="Type Kit ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleConfirmDelete}
        />
      </Modal>
    </div>
  );
};

export default KitTable;
