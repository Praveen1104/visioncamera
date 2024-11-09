import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Input } from "antd";
import { IoIosAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { FaCartPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import CustomVisionX from "../components/customer/CustomVisionX";
import axiosInstance from "../Util/AxiosInstance";

function CustomerTable({ customerData, custdataFlag, setCustDataFlag }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  // const [custdataFlag,setCustDataFlag] = useState(false);

  const filterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredData = customerData.filter((customer) => {
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "active" && customer.status === "active") ||
      (filterStatus === "not_active" && customer.status !== "active");

    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactNumber.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const openModal = (user) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/customer/customer-delete/${id}`
      );
      setCustDataFlag(!custdataFlag);
      setConfirmDeleteVisible(false);
      setInputValue(""); // Reset input value
    } catch (error) {
      console.log("There was a problem from Delete", error);
    }
  };

  const showConfirmDelete = (customerId) => {
    setSelectedCustomerId(customerId);
    setConfirmDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    if (inputValue === selectedCustomerId.toString()) {
      handleDelete(selectedCustomerId);
    } else {
      console.log("ID does not match");
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteVisible(false);
    setInputValue(""); // Reset input value
  };

  return (
    <div>
      <div className="flex-grow p-4">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-10 flex-row max-sm:flex-col justify-between max-sm:gap-5">
          <div className="flex flex-row gap-5 items-center justify-center max-md:flex-col">
            <div className="border-[--border-color] max-sm:w-full rounded-full flex overflow-hidden border bg-[--input-bg-color] w-fit text-[--text-color] px-5 gap-3 items-center justify-center">
              <FiSearch className="h-6 w-6" />
              <input
                type="text"
                className="text-[--text-color] bg-[--input-bg-color] outline-none py-2"
                placeholder="Search Customers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-hidden rounded-full max-sm:w-full w-fit border-[--border-color] text-[--text-color] border bg-[--input-bg-color] px-3">
              <select
                id="statusFilter"
                className="p-2 outline-none bg-[--input-bg-color] max-sm:w-full"
                onChange={filterChange}
              >
                <option value="All">Show: All</option>
                <option value="active">Active</option>
                <option value="not_active">Not Active</option>
              </select>
            </div>
          </div>
          <Link to="/addcustomer" className="max-sm:w-fit">
            <button className="w-fit max-md:h-fit max-sm:w-full flex flex-row items-center justify-evenly gap-2 bg-[#14161a] p-2 px-5 bg-opacity-45 rounded-full border-[--border-color] border">
              <p className="text-[--text-color]">Add Customer</p>
              <IoIosAdd className="bg-[#14161A] rounded-full" />
            </button>
          </Link>
        </div>

        {/* Customer Table */}
        <div className="relative overflow-x-auto shadow-md w-full h-full bg-zinc-900">
          <table className="w-full text-sm text-left">
            <thead className="text-base text-white uppercase bg-zinc-800">
              <tr>
                {[
                  "S.No",
                  "User name",
                  "Customer ID",
                  "Email",
                  "Mobile Number",
                  "Status",
                  "Details",
                  "Add VisionX",
                  "Delete",
                ].map((header, i) => (
                  <th key={i} scope="col" className="text-center p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user, index) => (
                  <tr
                    key={index}
                    className="bg-zinc-900 border-b border-[--border-color] text-center h-fit text-base hover:bg-zinc-700"
                  >
                    <td className="font-medium whitespace-nowrap text-center p-2">
                      {index + 1}
                    </td>
                    {[
                      "name",
                      "customerId",
                      "email",
                      "contactNumber",
                      "status",
                    ].map((field) => (
                      <td key={field} className="text-center p-2">
                        {field === "status" ? (
                          <p
                            className={`w-3 h-3 rounded-full mx-auto ${
                              user.status === true
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></p>
                        ) : (
                          user[field]
                        )}
                      </td>
                    ))}
                    <td className="text-center p-2">
                      <div className="h-full items-center justify-center flex">
                        <Link
                          to={`/eyeview/${user.customerId}`}
                          className="font-medium text-center flex items-center justify-center h-full"
                        >
                          <BsEye className="flex items-center justify-center h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <button
                        onClick={() => openModal(user)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        <FaCartPlus />
                      </button>
                    </td>
                    <td className="text-center p-2">
                      <Button
                        onClick={() => showConfirmDelete(user.customerId)}
                        className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                        icon={<FaTrash />}
                        danger
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400">
                    No matching customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      <Modal
        title={`Please confirm the ID to delete the customer-${selectedCustomerId}`}
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
        width={600} // Adjust this value as needed
        style={{ minWidth: "400px" }} // Optional: set a minimum width
      >
        <Input
          placeholder="Type customer ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleConfirmDelete}
        />
      </Modal>

      {/* Modal to display user data */}
      <Modal
        title="Add VisionX"
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <CustomVisionX handleClose={closeModal} selectedUser={selectedUser} />
        )}
      </Modal>
    </div>
  );
}

export default CustomerTable;
