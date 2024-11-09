import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../Util/AxiosInstance";
import { FiEdit } from "react-icons/fi";
import { Modal, Form, Input, message } from "antd";

function CustTable() {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch single customer data based on customerId
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`/customer/get-info/${customerId}`);
      setCustomerData(response.data.message);
      form.setFieldsValue(response.data.message); // Set form values to customer data
    } catch (error) {
      console.error("Error fetching customer data:", error);
      message.error("Failed to fetch customer data.");
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const showModal = () => {
    form.setFieldsValue(customerData); // Fill form with current customer data
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.patch(
        `/customer/customer-update/${customerId}`,
        values
      );
      message.success("Customer updated successfully!");
      setIsModalVisible(false);
      fetchCustomerData(); // Refresh customer data after update
    } catch (error) {
      console.error("Error updating customer:", error);
      message.error("Failed to update customer. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-5 flex flex-col gap-10 w-full">
      <div className="relative overflow-x-auto shadow-md rounded-lg border w-full border-[--border-color]">
        <table className="w-full capitalize text-xl text-white text-center flex flex-col items-center justify-center">
          <thead className="relative bg-[#26292e] w-full text-center flex items-center justify-center">
            <tr>
              <td className="py-2 flex items-center justify-center">
                Customer Details
                <FiEdit
                  className="absolute right-4 ml-2 cursor-pointer"
                  onClick={showModal}
                />
              </td>
            </tr>
          </thead>
          <tbody className="w-full max-sm:text-sm">
            <tr className="w-full flex max-md:flex-col max-md:w-full border-b border-[--border-color]">
              <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 max-md:w-full border-r border-[--border-color]">
                Customer Name
              </td>
              <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                {customerData?.name}
              </td>
            </tr>
            <tr className="w-full flex max-md:flex-col border-b border-[--border-color]">
              <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 max-md:w-full border-r border-[--border-color]">
                Customer ID
              </td>
              <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                {customerData?.customerId}
              </td>
            </tr>
            <tr className="w-full flex max-md:flex-col border-b border-[--border-color]">
              <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                Email ID
              </td>
              <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full lowercase">
                {customerData?.email}
              </td>
            </tr>
            <tr className="w-full flex max-md:flex-col border-b border-[--border-color]">
              <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                Contact Number
              </td>
              <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                {customerData?.contactNumber}
              </td>
            </tr>
            <tr className="w-full flex max-md:flex-col">
              <td className="px-6 py-4 bg-[#14161a] text-center w-1/2 border-r border-[--border-color] max-md:w-full">
                Address
              </td>
              <td className="px-6 py-4 bg-[#1b1d22] text-center w-1/2 max-md:w-full">
                {customerData?.address}, {customerData?.pincode}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal
        title="Edit Customer"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[
              { required: true, message: "Please enter the customer name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email ID"
            rules={[{ required: true, message: "Please enter the email ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter the contact number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[{ required: true, message: "Please enter the pincode" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustTable;
