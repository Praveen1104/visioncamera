import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import CustomerDetails from "./pages/CustomerDetails";
import EyeViewDetails from "./components/EyeViewDetails";
import AddCustomer from "./pages/AddCustomer";
import Navbar from "./components/Navbar";
import { CustomerProvider } from "./Context/CustomerContext";
import User from "./pages/User";
import UserCameraDetails from "./pages/UserCameraDetails";

function App() {
  return (
    <div className="relative">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="*"
            element={
              <>
                <div className="sticky top-0 z-50">
                  <Navbar />
                </div>
                <CustomerProvider>
                  <Routes>
                    <Route path="/addcustomer" element={<AddCustomer />} />
                    <Route path="/dashboard" element={<CustomerDetails />} />
                    <Route
                      path="/eyeview/:customerId"
                      element={<EyeViewDetails />}
                    />
                    <Route path="/user" element={<User />} />
                    <Route
                      path="/user-camera-details/:visionXId"
                      element={<UserCameraDetails />}
                    />
                  </Routes>
                </CustomerProvider>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
