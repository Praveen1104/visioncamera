import React, { useContext, useState } from "react";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import axios from "../../Util/AxiosInstance";
import CustomerContext from "../../Context/CustomerContext";

const VisionX = ({ handleNext, handlePrevious }) => {
  const { newCustomerID } = useContext(CustomerContext);
  const [formData, setFormData] = useState({
    id: "",
    location: "",
    cameras: 0,
    latitude: "",
    longitude: "",
    cameraDetails: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = "VisionX ID is required";
    if (!formData.latitude) newErrors.latitude = "Please Enter latitude";
    if (!formData.longitude) newErrors.longitude = "Please Enter longitude";
    if (!formData.location) newErrors.location = "Please Enter Location";
    if (formData.cameras < 1 || formData.cameras > 25) {
      newErrors.cameras = "At least 1 and no more than 25 cameras are required";
    }
    if (formData.cameraDetails.length === 0) {
      newErrors.cameraDetails = "Please enter camera details";
    } else {
      formData.cameraDetails.forEach((camera, index) => {
        if (!camera.ip) {
          newErrors[`cameraDetails_${index}_ip`] = "Please Enter Camera IP";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCameraCountChange = (count) => {
    if (count < 0 || count > 25) return; // Prevent invalid counts
    setFormData((prev) => ({
      ...prev,
      cameras: count,
      cameraDetails: Array.from({ length: count }, (_, i) => ({
        ip: prev.cameraDetails[i]?.ip || "",
        cameraPosition: prev.cameraDetails[i]?.cameraPosition || "",
        image: prev.cameraDetails[i]?.image || null,
      })),
    }));
  };

  const handleCameraDetailChange = (cameraIndex, field, value) => {
    const updatedCameraDetails = [...formData.cameraDetails];
    updatedCameraDetails[cameraIndex][field] = value;
    setFormData((prev) => ({ ...prev, cameraDetails: updatedCameraDetails }));
  };

  const handleImageChange = (cameraIndex, file) => {
    const updatedCameraDetails = [...formData.cameraDetails];
    updatedCameraDetails[cameraIndex].image = file;
    setFormData((prev) => ({ ...prev, cameraDetails: updatedCameraDetails }));
  };

  const handleDeleteCamera = (cameraIndex) => {
    const updatedCameraDetails = formData.cameraDetails.filter(
      (_, index) => index !== cameraIndex
    );
    setFormData((prev) => ({
      ...prev,
      cameraDetails: updatedCameraDetails,
      cameras: updatedCameraDetails.length,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation checks
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("customerId", newCustomerID);
    formDataToSend.append("visionXId", formData.id);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("numberOfCameras", formData.cameras);

    // Prepare camera details without images (as a JSON string)
    const cameraDetailsWithoutImages = formData.cameraDetails.map((camera) => ({
      ip: camera.ip,
      cameraPosition: camera.cameraPosition,
      status: camera.status, // Add any other necessary fields
    }));

    // Append the camera details as a JSON string
    formDataToSend.append(
      "cameraStatuses",
      JSON.stringify(cameraDetailsWithoutImages)
    );

    // Append camera images separately
    formData.cameraDetails.forEach((camera, index) => {
      if (camera.image) {
        formDataToSend.append("cameraImage", camera.image); // Using a common name for all camera images
      }
    });



    try {
      await axios.post("/kit/new-kit", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleNext(); // Proceed to the next step if form submission succeeds
    } catch (err) {
      console.error(err);
      // Optionally, you could set an error message to display to the user here
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-white text-xl mb-4">VisionX Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-white text-lg mb-2">VisionX #</h2>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label>Latitude</label>
              <input
                type="text"
                name="latitude"
                className="w-full mb-4 p-2 bg-[--input-bg-color]"
                placeholder="Enter latitude"
                value={formData.latitude}
                onChange={handleChange}
              />
              {errors.latitude && (
                <div className="text-red-500">{errors.latitude}</div>
              )}
            </div>
            <div className="w-1/2">
              <label>Longitude</label>
              <input
                type="text"
                name="longitude"
                className="w-full mb-4 p-2 bg-[--input-bg-color]"
                placeholder="Enter longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
              {errors.longitude && (
                <div className="text-red-500">{errors.longitude}</div>
              )}
            </div>
          </div>

          <label>VisionX ID</label>
          <input
            type="text"
            name="id"
            className="w-full mb-4 p-2 bg-[--input-bg-color]"
            placeholder="Enter VisionX ID"
            value={formData.id}
            onChange={handleChange}
          />
          {errors.id && <div className="text-red-500">{errors.id}</div>}

          <label>Monitoring Location</label>
          <input
            type="text"
            name="location"
            className="w-full mb-4 p-2 bg-[--input-bg-color]"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && (
            <div className="text-red-500">{errors.location}</div>
          )}

          <label>No Of Cameras</label>
          <input
            type="number"
            name="cameras"
            min={1}
            max={25}
            className="w-full mb-4 p-2 bg-[--input-bg-color]"
            value={formData.cameras}
            onChange={(e) =>
              handleCameraCountChange(parseInt(e.target.value) || 0)
            }
          />
          {errors.cameras && (
            <div className="text-red-500">{errors.cameras}</div>
          )}

          {formData.cameraDetails.map((camera, cameraIndex) => (
            <div key={cameraIndex} className="mb-4 my-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-md">
                  Camera #{cameraIndex + 1}
                </h3>
                <div
                  className="bg-red-500 text-white px-2 py-1 rounded w-fit cursor-pointer"
                  onClick={() => handleDeleteCamera(cameraIndex)}
                >
                  <MdOutlineDelete />
                </div>
              </div>
              <div className="flex max-sm:flex-col space-x-4 max-md:space-x-0 border-[--border-color] border p-5 rounded-md shadow-[0_0_5px_0] shadow-[--input-bg-color]">
                <div className="w-1/2 max-sm:w-full">
                  <label>Camera IP</label>
                  <input
                    type="text"
                    className="w-full mb-4 p-2 bg-[--input-bg-color]"
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
                    <div className="text-red-500">
                      {errors[`cameraDetails_${cameraIndex}_ip`]}
                    </div>
                  )}
                </div>
                <div className="w-1/2 max-sm:w-full">
                  <label>Camera Position</label>
                  <input
                    type="text"
                    className="w-full mb-4 p-2 bg-[--input-bg-color]"
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
                    <div className="text-red-500">
                      {errors[`cameraDetails_${cameraIndex}_cameraPosition`]}
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label>Camera Image</label>
                  <input
                    type="file"
                    className="w-full mb-4 p-2 bg-[--input-bg-color]"
                    onChange={(e) =>
                      handleImageChange(cameraIndex, e.target.files[0])
                    }
                  />
                  {errors[`cameraDetails_${cameraIndex}_image`] && (
                    <div className="text-red-500">
                      {errors[`cameraDetails_${cameraIndex}_image`]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            className="text-white bg-blue-500 px-4 py-2 rounded"
          >
            <GrCaretPrevious /> Back
          </button>
          <button
            type="submit"
            className="text-white bg-blue-500 px-4 py-2 rounded"
          >
            Next <GrCaretNext />
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisionX;
