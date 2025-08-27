// axios.ts
import axios, { AxiosError } from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle unauthorized (401)
    if (error.response?.status === 401) {
      console.error("Unauthorized, logging out...");
      // Example: redirect to login or refresh token
      // window.location.href = "/login";
    }

    // Handle forbidden (403)
    if (error.response?.status === 403) {
      console.error("Forbidden request.");
    }

    return Promise.reject(error);
  }
);

export default api;
