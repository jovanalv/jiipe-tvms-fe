import { apiClient } from "../axiosInstance";

export const getMenus = async () => {
  try {
    const response = await apiClient.get("menus", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getRoles = async () => {
  try {
    const response = await apiClient.get("roles", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const createRole = async (payload) => {
  try {
    const response = await apiClient.post(`roles`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const updateRole = async (id, payload) => {
  try {
    const response = await apiClient.put(`roles/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating area:", error);
    throw error?.response?.data;
  }
};
