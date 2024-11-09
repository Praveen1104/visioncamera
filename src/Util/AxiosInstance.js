import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://visionx.quantumsharq.com/api",
  baseURL: "https://visioncameraback.onrender.com",
  // baseURL: "http://localhost:7001",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
// export const baseURL = "https://visionx.quantumsharq.com/api";
export const baseURL = "https://visioncameraback.onrender.com";

// https://visionx.quantumsharq.com/api/
