import { apiClient } from "../axiosInstance";

export const getMenu = async () => {
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
