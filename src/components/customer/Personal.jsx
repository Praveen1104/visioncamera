import React, { useContext, useState, useEffect } from "react";
import axios from "../../Util/AxiosInstance";
import CustomerContext from "../../Context/CustomerContext";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Personal = ({ handleNext }) => {
  const { handleNewCustomarID } = useContext(CustomerContext);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    pincode: "",
    content: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Please Enter Your Name";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Please Enter Your Number";
    if (!formData.email) newErrors.email = "Please Enter Your Email";
    if (!formData.address) newErrors.address = "Please Enter Your Address";
    if (!formData.pincode) newErrors.pincode = "Please Enter Your Pincode";
    return newErrors;
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  //   if (errors[name]) {
  //     setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Start the submission process
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitted(false); // Reset the submission state
      return;
    }
  
    const data = new FormData();
    const cleanedContactNumber = parseInt(formData.contactNumber.replace(/[^\d]/g, ''), 10);
    if (isNaN(cleanedContactNumber)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        contactNumber: "Please enter a valid phone number"
      }));
      setIsSubmitted(false);
      return;
    }
    
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("contactNumber", cleanedContactNumber);
    data.append("address", formData.address);
    data.append("pincode", formData.pincode);
    data.append("content", formData.content);
  
    // Append images if they exist
    if (formData.addressImage) data.append("addressImg", formData.addressImage);
    if (formData.contentLogo) data.append("contentLogo", formData.contentLogo);
    if (formData.contentImage) data.append("contentImage", formData.contentImage);
  
    try {
      const response = await axios.post(`/customer/new`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      console.log(response);
      
  
      if (response.status === 200) {
        toast.success("Personal information added successfully!");
      } else {
        toast.error("Failed to add personal information.");
      }
  
      handleNewCustomarID(response.data.response.customerId);
        setIsSubmitted(true);
      setTimeout(() => {
        handleNext();
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
      setIsSubmitted(false); // Reset the submission state
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitted(true); // Start the submission process
  //   const validationErrors = validate();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     setIsSubmitted(false); // Reset the submission state
  //     return;
  //   }

  //   const data = new FormData();
  //     // Append form data fields
  //     data.append("name", formData.name);
  //     data.append("email", formData.email);
  //     data.append("contactNumber", parseInt(formData.contactNumber.replace(/[^\d]/g, ''), 10));
  //     data.append("address", formData.address);
  //     data.append("pincode", formData.pincode);
  //     data.append("content", formData.content);
  
  //     // Append images
  //     if (formData.addressImage) data.append("addressImg", formData.addressImage);
  //     if (formData.contentLogo) data.append("contentLogo", formData.contentLogo);
  //     if (formData.contentImage) data.append("contentImage", formData.contentImage);
      

  
      
  //   try {
      
  //   for (let [key, value] of data.entries()) {
  //     console.log(`${key}:`, value);
  //   }

  //   // const response = await axios.post(`/customer/new`, data);
      
  //   const response = await axios.post(`/customer/new`, data, {
  //     headers: {
  //       "Content-Type": "multipart/form-data", // Important for file uploads
  //     },
  //   });
  //   // const responseData = await response.json(); // Parse the JSON response
  //   console.log(response);

    
  //   if (response.ok) {
  //     toast.success("Personal information added successfully!");
  //   } else {
  //     toast.error("Failed to add personal information.");
  //   }

    
      
  //     // handleNewCustomarID(response.data.response.customerId);
  //     toast.success("Personal information added successfully!");
  //     // setIsSubmitted(true);
  //     // setTimeout(() => {
  //       // handleNext();
  //     // }, 2000);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Something went wrong");
  //   }
  // };

  return (
    <div className="m-5">
      <h1 className="text-white text-xl mb-4">Personal Information</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <div className="text-red-500">{errors.name}</div>}

        <label htmlFor="contactNumber">Mobile Number</label>
        <input
          type="tel"
          name="contactNumber"
          placeholder="Mobile number"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          value={formData.contactNumber}
          onChange={handleChange}
        />
        {errors.contactNumber && (
          <div className="text-red-500">{errors.contactNumber}</div>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="text-red-500">{errors.email}</div>}

        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter Address"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <div className="text-red-500">{errors.address}</div>}

        <label htmlFor="pincode">Pincode</label>
        <input
          type="number"
          name="pincode"
          placeholder="Enter pincode"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          value={formData.pincode}
          onChange={handleChange}
        />
        {errors.pincode && <div className="text-red-500">{errors.pincode}</div>}

        <label htmlFor="addressImage">Address Image:</label>
        <input
          type="file"
          name="addressImage"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          onChange={handleChange}
        />

        <label htmlFor="content">content</label>
        <input
          type="text"
          name="content"
          placeholder="Enter content"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          value={formData.content}
          onChange={handleChange}
        />
        {errors.pincode && <div className="text-red-500">{errors.content}</div>}

        <label htmlFor="contentLogo">Content Logo:</label>
        <input
          type="file"
          name="contentLogo"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          onChange={handleChange}
        />

        <label htmlFor="contentImage">Content Image:</label>
        <input
          type="file"
          name="contentImage"
          className="w-full mb-4 p-2 bg-[--input-bg-color]"
          onChange={handleChange}
        />

        <div className="flex flex-row items-center justify-between gap-5">
          <Link className="w-full" to={"/dashboard"}>
            <button className="w-full mb-4 bg-blue-500 text-white py-2 rounded">
              Back
            </button>
          </Link>
          <button
            type="submit"
            className="w-full mb-4 bg-blue-500 text-white py-2 rounded"
          >
            Next
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default Personal;
