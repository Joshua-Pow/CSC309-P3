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
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("No refresh token available.");
          // Redirect to login page
          window.dispatchEvent(new CustomEvent("refreshTokenFailed"));
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }
        const refreshResponse = await axiosInstance.post("auth/refresh/", {
          refresh: refreshToken,
        });
        if (refreshResponse.status === 401) {
          console.error("Invalid refresh token.");
          // Redirect to login page
          window.dispatchEvent(new CustomEvent("refreshTokenFailed"));
          return Promise.reject(error);
        } else if (refreshResponse.status !== 200) {
          console.error("Error refreshing token.");
          return Promise.reject(error);
        }
        const { access } = refreshResponse.data;
        localStorage.setItem("accessToken", access);
        originalRequest.headers["Authorization"] = "Bearer " + access;
        return axiosInstance(originalRequest);
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Redirect to login page
        window.dispatchEvent(new CustomEvent("refreshTokenFailed"));
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
