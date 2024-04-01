import axios from "axios";
import { RegisterUser } from "@/app/auth/register/page";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Your API base URL
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export const registerUser = async (userData: RegisterUser) => {
  try {
    const response = await axiosInstance.post("auth/register/", userData);
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("auth/login/", credentials);
    return response; // Just return the response here
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Axios interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return for successful responses
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // Handle case where there is no refresh token available
          console.error("No refresh token available.");
          return Promise.reject(error);
        }
        const refreshResponse = await axiosInstance.post("auth/refresh/", {
          refresh: refreshToken,
        });
        const { access } = refreshResponse.data;
        // Assume the context or somewhere else updates the localStorage, just update the request here
        originalRequest.headers["Authorization"] = "Bearer " + access;
        return axiosInstance(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
