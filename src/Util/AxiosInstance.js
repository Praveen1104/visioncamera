import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://visionx.quantumsharq.com/api",
  baseURL: "http://localhost:7001",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
// export const baseURL = "https://visionx.quantumsharq.com/api";
export const baseURL = "http://localhost:7001";

// https://visionx.quantumsharq.com/api/
