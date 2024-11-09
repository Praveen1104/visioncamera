import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

//Used sweetalert2 for Popup Success Message.
const Camera = () => {
  const navigate = useNavigate();
  const showSuccessPopup = () => {
    Swal.fire({
      title: "Registration Successful!",
      icon: "success",
      showConfirmButton: false,
      backdrop: true,
      position: "center",
      background: "#1c1c1c",
      color: "#ffffff",
    });
    setTimeout(() => {
      Swal.close();
      navigate("/dashboard");
    }, 5000);
  };

  React.useEffect(() => {
    showSuccessPopup();
  }, []);

  return null;
};

export default Camera;
