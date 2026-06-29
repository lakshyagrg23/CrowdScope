import axios from "axios";

// Helper to get or create device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem("crowdscope-device-id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("crowdscope-device-id", deviceId);
  }
  return deviceId;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers["X-Device-ID"] = getDeviceId();
  return config;
});

export default api;
