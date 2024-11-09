import React, { useState, useEffect } from "react";
import "../styles/App.css";
import Cards from "../components/Cards";
import CustomerTable from "../components/CustomerTable";
import background from "../assets/background.jpg";
import axios from "../Util/AxiosInstance";
import MonitoringArea from "../components/MonitoringArea";
import { baseURL } from "../Util/AxiosInstance";
function CustomerDetails() {
  const [customerData, setCustomerData] = useState([]);
  const [custdataFlag, setCustDataFlag] = useState(false);
  const cardData = [
    {
      title: "Quantum Vision X",
      subTitle: "Total no of Saled VisionX",
      totalKit: customerData.length || 0,
    },
  ];
  const custData = async () => {
    try {
      const response = await axios.get("/customer/get-info");
      setCustomerData(response.data.message);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    custData();

    const ws = new WebSocket(baseURL);
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      custData();
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [custdataFlag]);

  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-zinc-900 text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-row w-full gap-5 p-5 max-md:flex-col">
          <Cards cardData={cardData} />
        </div>

        <div className="p-4 py-2">
          <h2 className="text-2xl font-bold text-left">Customer Details</h2>
        </div>

        <CustomerTable
          custdataFlag={custdataFlag}
          setCustDataFlag={setCustDataFlag}
          customerData={customerData}
        />
        <MonitoringArea customerData={customerData} />
      </div>
    </>
  );
}

export default CustomerDetails;
