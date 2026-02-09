import axios from "axios";
import { getApiBaseUrl } from "../../utils/config";
import { apiClient, apiPublic } from "../axiosInstance";

export const checkIsLogin = async () => {
  try {
    const response = await apiClient.get(`get-menu-user`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const login = async (payload) => {
  try {
    const response = await axios.post(`${getApiBaseUrl()}login/`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post(`logout/`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const getCaptcha = async () => {
  try {
    const response = await apiPublic.get(`get-captcha`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};
