import React, { useState, useEffect } from "react";
import "../styles/App.css";
import X from "../assets/x.svg";
import TnCm from "../assets/TnCm.png";
import TnLogo from "../assets/TnLogo.png";
import background from "../assets/background.jpg";
import axios, { baseURL } from "../Util/AxiosInstance";
import { Link } from "react-router-dom";
import { FaRegDotCircle } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import tgm from "../assets/tgm.jpg";
import CameraDashboardCard from "../components/CameraDashboardCard";
import CameraDetailsTable from "../components/CameraDetailsTable";

function User() {
  const [kitData, setKitData] = useState([]);
  const [divShow, setDivShow] = useState(false);
  const [cameraData, setCameraData] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const getLocalStorageData = localStorage.getItem("Credentials");
  const localStorageDataJSON = JSON.parse(getLocalStorageData);

  const [customerData, setCustomerData] = useState("");

  const getKitData = async () => {
    try {
      const response = await axios.get(
        `/kit/get-kits/${localStorageDataJSON?.customerId}`
      );
      setKitData(response.data.response);
    } catch (error) {
      console.error("Error fetching kit data:", error);
    }
  };

  const [selectedkitID, setselectedKitId] = useState();

  const handleCardClick = (cameraId) => {
    setselectedKitId(cameraId);
    const selected = kitData.find((data) => data.visionXId === cameraId);
    setSelectedCamera(selected);
  };

  // useEffect(() => {
  //   const selected = kitData.find((data) => data.visionXId === selectedkitID);
  //   setSelectedCamera(selected);
  // }, [kitData]);
  console.log(selectedCamera);
  const getKitDatas = async () => {
    try {
      if (selectedCamera) {
        const response = await axios.get(
          `/kit/get-kit/${selectedCamera.visionXId}`
        );
        setCameraData(response.data.response.cameraStatuses);
      }
    } catch (error) {
      console.error("Error fetching camera data:", error);
    }
  };

  const getCustomerData = async () => {
    try {
      const response = await axios.get(
        `/customer/get-info/${localStorageDataJSON?.customerId}`
      );
      setCustomerData(response.data.message);
      console.log(customerData);
      return response.data.response;
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // useEffect(() => {
  //   if (localStorageDataJSON?.customerId) {
  //     getKitData();
  //     getCustomerData();
  //   }
  //   if (selectedCamera) {
  //     getKitDatas();
  //   }
  // }, []);

  // setInterval(() => {
  //   getKitData();
  //   getKitDatas();
  // }, 5000);
  useEffect(() => {
    getKitData();
    getKitDatas();
    const ws = new WebSocket(baseURL);

    // On WebSocket connection open
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    // On WebSocket message received
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      custData(); // Update data when a message is received
    };

    // On WebSocket connection close
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // On WebSocket error
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup function to close WebSocket connection when the component unmounts or dependency changes
    return () => {
      ws.close();
    };
    // const intervalId = setInterval(() => {
    //   getKitData();
    //   console.log(selectedCamera);
    //   if (selectedCamera) {
    //     getKitDatas();
    //     handleCardClick(selectedCamera.visionXId);
    //     console.log(selectedCamera.visionXId);
    //   }
    // }, 3000);

    // return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedCamera]);

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
          <div className="flex flex-wrap flex-row border-[--border-color] border bg-[#ffffff] bg-opacity-10 backdrop-blur-md w-full items-center justify-center h-72 rounded-xl max-lg:h-full">
            <div className="flex flex-row max-lg:flex-col relative w-full items-center justify-between h-full">
              <div className="w-fit h-full p-2 px-0 md:p-4 text-left text-white flex flex-col items-center justify-evenly">
                <h2 className="text-5xl text-nowrap w-full font-bold max-md:text-3xl max-md:text-center">
                  Quantum Vision X
                </h2>
                <p className="mt-2 w-full max-md:text-center text-3xl font-normal text-nowrap max-md:text-xl">
                  Total No of VisionX : {kitData?.length || 0}
                </p>
              </div>

              <img
                className="absolute right-2/3 -z-10 flex h-full opacity-40 max-lg:hidden"
                src={X}
                alt="Quantum Vision X"
              />

              <div className="flex flex-col text-center w-full justify-center items-center">
                <img
                  className="object-contain -z-10 flex w-20 h-20"
                  src={TnLogo}
                  alt="TN Logo"
                />
                <p className=" font-medium text-justify max-2xl:px-6 px-20 h-32 max-xl:overflow-y-auto scrollbar-hide">
                  {/* {customerData.content} */}
                  <span className="text-xs">
                    {" "}
                    தமிழ்நாடு முதலமைச்சரின் ஆணைக்கிணங்க, நாமக்கல் மாவட்டம்
                    திருச்செங்கோடு மாநகராட்சி முழுவதும் 500க்கும் மேற்பட்ட
                    சிசிடிவி கேமராக்கள் மக்கள் பொதுமக்களின் பாதுகாப்பை உறுதி
                    செய்யும் விதமாக பொருத்தப்பட்டுள்ளது. இது சில தொழில்நுட்ப
                    கோளாறு காரணமாக சில நேரங்களில் பொருத்தப்பட்ட சிசிடிவி
                    கேமராக்கள் சரிவர செயல்படுவதில்லை. அதனால், அதனை சரி செய்யும்
                    பொருட்டு திருச்செங்கோடு நகர காவல்துறை{" "}
                  </span>
                  <span className="text-lg">
                    {" "}
                    Quantum Sharq Innovative Solutions{" "}
                  </span>
                  <span className="text-xs">
                    {" "}
                    எனும் மென்பொருள் நிறுவனத்துடன் இணைந்து{" "}
                  </span>
                  <span className="text-lg"> Quantum Vision X </span>
                  <span className="text-xs">
                    {" "}
                    எனும் உயர்தர சிசிடிவி கண்காணிப்பு கருவி மூலமாக,
                    பொருத்தப்பட்ட கேமராக்களின் நேரலை தொடர்பு 24 மணி நேரமும்
                    கண்காணிக்கப்படுகிறது. இது கேமராக்களின் பாதுகாப்பு மற்றும்
                    மக்கள் நலத்தை உறுதிசெய்கிறது.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 py-2 flex flex-row gap-5 items-center justify-start">
          <h2 className="text-2xl font-bold text-left">Details</h2>
          <button onClick={() => setDivShow(true)}>
            <BiDetail />
          </button>
        </div>

        <div
          className={`${
            divShow ? "block" : "hidden"
          } w-[100vw] h-[90vh] fixed z-50 bottom-0 left-0 transform bg-zinc-800 bg-opacity-80`}
        >
          <div className="w-[90vw] h-[70vh] gap-5 relative flex flex-row items-center justify-between z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-white border border-zinc-700 rounded-lg shadow-lg p-4">
            <IoClose
              className="absolute top-4 right-4 text-2xl cursor-pointer"
              onClick={() => setDivShow(false)}
            />
            <div className="flex justify-center items-center mb-4 w-1/2">
              <h2 className="text-2xl font-bold p-5">{customerData.address}</h2>
            </div>
            <div className="flex flex-col gap-2">
              <img src={tgm} alt="" />
            </div>
          </div>
        </div>

        <div>
          <CameraDashboardCard kitData={kitData} />
        </div>

        <div className="w-full p-4 gap-5 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kitData?.map((data, key) => (
              <div key={key} onClick={() => handleCardClick(data.visionXId)}>
                <div className="bg-[--input-bg-color] flex flex-col gap-5 rounded-xl shadow-md p-4 cursor-pointer text-center">
                  <div className="bg-[#26292e] p-2 rounded-xl flex items-center justify-between">
                    <p>{data.visionXId}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-1 py-1 text-xs font-medium ${
                        data.status === "true" || data.status === true
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <FaRegDotCircle />
                    </span>
                  </div>
                  <div className="flex flex-row w-full justify-evenly items-center gap-5">
                    <div className="border border-[--border-color] rounded-xl w-full overflow-hidden">
                      <p className="w-full flex items-center justify-center bg-[#26292e]">
                        Location
                      </p>
                      <p className="w-full flex items-center justify-center font-semibold">
                        {data.location}
                      </p>
                    </div>
                    <div className="border border-[--border-color] rounded-xl w-full overflow-hidden">
                      <p className="w-full flex items-center justify-center bg-[#26292e]">
                        No. Of Cameras
                      </p>
                      <div className="flex items-center justify-center font-semibold">
                        {data.cameraStatuses?.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCamera && (
          <div className="mt-6 p-4 bg-cardColor rounded-xl shadow-lg">
            <div className="mb-4 p-4 bg-gray-700 rounded-lg text-white flex justify-between items-center">
              <p className="text-lg font-semibold">
                <strong>VisionX ID:</strong> {selectedCamera?.visionXId}
              </p>
              <p className="text-lg font-semibold">
                <strong>Location:</strong> {selectedCamera?.location}
              </p>
              <p className="text-lg font-semibold">
                <strong>No. of Cameras:</strong>{" "}
                {selectedCamera?.cameraStatuses?.length}
              </p>
            </div>

            <table className="min-w-full bg-zinc-800 text-white border border-zinc-700">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-zinc-700">S No</th>
                  <th className="py-2 px-4 border-b border-zinc-700">
                    IP Address
                  </th>
                  <th className="py-2 px-4 border-b border-zinc-700">Status</th>
                  <th className="py-2 px-4 border-b border-zinc-700">
                    Coverage
                  </th>
                  <th className="py-2 px-4 border-b border-zinc-700">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCamera?.cameraStatuses?.map((camera, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b border-zinc-700">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b border-zinc-700">
                      {camera.ip}
                    </td>
                    <td className="py-2 px-4 border-b border-zinc-700">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          camera.status === "Online"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {camera.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-zinc-700">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          camera.Coverage === "Screen not interrupted"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {camera?.Coverage}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-zinc-700">
                      {camera.cameraPosition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default User;
