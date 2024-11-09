import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineDelete } from "react-icons/md";
import axiosInstance from "../../Util/AxiosInstance";

const CustomVisionX = ({ selectedUser, handleClose }) => {
  const [values, setValues] = useState({
    id: "",
    location: "",
    cameras: 0,
    latitude: "",
    longitude: "",
    cameraDetails: [],
  });

  const [errors, setErrors] = useState({}); // State for validation errors

  const handleCameraCountChange = (count) => {
    setValues((prevValues) => {
      const updatedCameraDetails = Array.from({ length: count }, (_, i) => ({
        ip: prevValues.cameraDetails[i]?.ip || "",
        cameraPosition: prevValues.cameraDetails[i]?.cameraPosition || "",
        image: prevValues.cameraDetails[i]?.image || null,
        status: prevValues.cameraDetails[i]?.status || "Active",
      }));
      return {
        ...prevValues,
        cameras: count,
        cameraDetails: updatedCameraDetails,
      };
    });
  };

  const handleCameraDetailChange = (cameraIndex, field, value) => {
    setValues((prevValues) => {
      const updatedCameraDetails = [...prevValues.cameraDetails];
      updatedCameraDetails[cameraIndex][field] = value;
      return { ...prevValues, cameraDetails: updatedCameraDetails };
    });
  };

  const handleFileChange = (cameraIndex, file) => {
    setValues((prevValues) => {
      const updatedCameraDetails = [...prevValues.cameraDetails];
      updatedCameraDetails[cameraIndex].image = file;
      return { ...prevValues, cameraDetails: updatedCameraDetails };
    });
  };

  const handleDeleteCamera = (cameraIndex) => {
    setValues((prevValues) => {
      const updatedCameraDetails = prevValues.cameraDetails.filter(
        (_, index) => index !== cameraIndex
      );
      return {
        ...prevValues,
        cameraDetails: updatedCameraDetails,
        cameras: updatedCameraDetails.length,
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!values.id) newErrors.id = "VisionX ID is required";
    if (!values.latitude) newErrors.latitude = "Please enter latitude";
    if (!values.longitude) newErrors.longitude = "Please enter longitude";
    if (!values.location) newErrors.location = "Please enter location";
    if (values.cameras < 1 || values.cameras > 25) {
      newErrors.cameras = "At least 1 and no more than 25 cameras are required";
    }
    if (values.cameraDetails.length === 0) {
      newErrors.cameraDetails = "Please enter camera details";
    } else {
      values.cameraDetails.forEach((camera, index) => {
        if (!camera.ip) {
          newErrors[`cameraDetails_${index}_ip`] = "Please enter camera IP";
        }
        if (!camera.cameraPosition) {
          newErrors[`cameraDetails_${index}_cameraPosition`] =
            "Please enter camera position";
        }
        if (!camera.image) {
          newErrors[`cameraDetails_${index}_image`] =
            "Please upload camera image";
        }
      });
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation checks
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are errors
    } else {
      setErrors({}); // Clear errors if validation is successful
    }

    const formData = new FormData();
    formData.append("customerId", selectedUser.customerId);
    formData.append("visionXId", values.id);
    formData.append("latitude", values.latitude);
    formData.append("longitude", values.longitude);
    formData.append("location", values.location);
    formData.append("numberOfCameras", values.cameras);

    const cameraDetailsWithoutImages = values.cameraDetails.map((camera) => ({
      ip: camera.ip,
      cameraPosition: camera.cameraPosition,
      status: camera.status, // Add any other necessary fields
    }));

    // Append the camera details as a JSON string
    formData.append(
      "cameraStatuses",
      JSON.stringify(cameraDetailsWithoutImages)
    );

    // Append camera images separately
    values.cameraDetails.forEach((camera) => {
      if (camera.image) {
        formData.append("cameraImage", camera.image); // Using a common name for all camera images
      }
    });

    try {
      await axiosInstance.post("/kit/new-kit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleClose();
      toast.success("Vision X Registered Successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering Vision X");
    }
  };

  return (
    <div className="m-5">
      <Toaster />
      <h1 className="text-black text-xl mb-4">VisionX Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-black text-lg mb-2">VisionX</h2>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label>Latitude</label>
              <input
                type="text"
                name="latitude"
                className={`w-full mb-4 p-2 border ${
                  errors.latitude ? "border-red-500" : "border-gray-700"
                } rounded`}
                placeholder="Enter latitude"
                value={values.latitude}
                onChange={(e) =>
                  setValues({ ...values, latitude: e.target.value })
                }
              />
              {errors.latitude && (
                <span className="text-red-500">{errors.latitude}</span>
              )}
            </div>
            <div className="w-1/2">
              <label>Longitude</label>
              <input
                type="text"
                name="longitude"
                className={`w-full mb-4 p-2 border ${
                  errors.longitude ? "border-red-500" : "border-gray-700"
                } rounded`}
                placeholder="Enter longitude"
                value={values.longitude}
                onChange={(e) =>
                  setValues({ ...values, longitude: e.target.value })
                }
              />
              {errors.longitude && (
                <span className="text-red-500">{errors.longitude}</span>
              )}
            </div>
          </div>

          <label>VisionX ID</label>
          <input
            type="text"
            name="id"
            className={`w-full mb-4 p-2 border ${
              errors.id ? "border-red-500" : "border-gray-700"
            } rounded`}
            placeholder="Enter VisionX ID"
            value={values.id}
            onChange={(e) => setValues({ ...values, id: e.target.value })}
          />
          {errors.id && <span className="text-red-500">{errors.id}</span>}

          <label>Monitoring Location</label>
          <input
            type="text"
            name="location"
            className={`w-full mb-4 p-2 border ${
              errors.location ? "border-red-500" : "border-gray-700"
            } rounded`}
            placeholder="Enter location"
            value={values.location}
            onChange={(e) => setValues({ ...values, location: e.target.value })}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location}</span>
          )}

          <label>No Of Cameras</label>
          <input
            type="number"
            name="cameras"
            min={1}
            max={25}
            className={`w-full mb-4 p-2 border ${
              errors.cameras ? "border-red-500" : "border-gray-700"
            } rounded`}
            value={values.cameras}
            onChange={(e) => handleCameraCountChange(parseInt(e.target.value))}
          />
          {errors.cameras && (
            <span className="text-red-500">{errors.cameras}</span>
          )}

          {values.cameraDetails.map((camera, cameraIndex) => (
            <div key={cameraIndex} className="mb-4 my-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-black text-md">
                  Camera #{cameraIndex + 1}
                </h3>
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteCamera(cameraIndex)}
                >
                  <MdOutlineDelete />
                </button>
              </div>
              <div className="flex flex-col space-y-4 border border-gray-300 p-5 rounded-md shadow-md">
                <div className="w-full">
                  <label>Camera IP</label>
                  <input
                    type="text"
                    name="ip"
                    className={`w-full mb-4 p-2 border ${
                      errors[`cameraDetails_${cameraIndex}_ip`]
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded`}
                    placeholder="Enter camera IP"
                    value={camera.ip}
                    onChange={(e) =>
                      handleCameraDetailChange(
                        cameraIndex,
                        "ip",
                        e.target.value
                      )
                    }
                  />
                  {errors[`cameraDetails_${cameraIndex}_ip`] && (
                    <span className="text-red-500">
                      {errors[`cameraDetails_${cameraIndex}_ip`]}
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <label>Camera Position</label>
                  <input
                    type="text"
                    name="cameraPosition"
                    className={`w-full mb-4 p-2 border ${
                      errors[`cameraDetails_${cameraIndex}_cameraPosition`]
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded`}
                    placeholder="Enter camera position"
                    value={camera.cameraPosition}
                    onChange={(e) =>
                      handleCameraDetailChange(
                        cameraIndex,
                        "cameraPosition",
                        e.target.value
                      )
                    }
                  />
                  {errors[`cameraDetails_${cameraIndex}_cameraPosition`] && (
                    <span className="text-red-500">
                      {errors[`cameraDetails_${cameraIndex}_cameraPosition`]}
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <label>Camera Image</label>
                  <input
                    type="file"
                    className={`w-full mb-4 p-2 border ${
                      errors[`cameraDetails_${cameraIndex}_image`]
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded`}
                    onChange={(e) =>
                      handleFileChange(cameraIndex, e.target.files[0])
                    }
                  />
                  {errors[`cameraDetails_${cameraIndex}_image`] && (
                    <span className="text-red-500">
                      {errors[`cameraDetails_${cameraIndex}_image`]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomVisionX;
