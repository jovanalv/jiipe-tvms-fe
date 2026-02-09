import { apiClient } from "../axiosInstance";

export const getGroupMenu = async () => {
  try {
    const response = await apiClient.get("group-menu", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

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

export const createMenu = async (payload) => {
  try {
    const response = await apiClient.post(`menus`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const updateMenu = async (id, payload) => {
  try {
    const response = await apiClient.put(`menus/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating area:", error);
    throw error?.response?.data;
  }
};
