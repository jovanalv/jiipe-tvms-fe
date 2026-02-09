import { apiClient } from "../axiosInstance";

export const getProfile = async () => {
  try {
    const response = await apiClient.get("get-user", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const updateProfile = async (payload) => {
  try {
    const response = await apiClient.put(`update-myprofile`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};
