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

export const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers["X-Device-ID"] = getDeviceId();
  return config;
});

export default api;
