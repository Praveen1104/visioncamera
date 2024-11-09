import React, { createContext, useState } from "react";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [newCustomerID, setCustomerID] = useState("");

  const handleNewCustomarID = (customerID) => {
    setCustomerID(customerID);
  };

  return (
    <CustomerContext.Provider value={{ newCustomerID, handleNewCustomarID }}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerContext;
