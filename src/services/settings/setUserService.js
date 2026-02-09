import { apiClient } from "../axiosInstance";

export const getEmployeePIC = async () => {
  try {
    const response = await apiClient.get("users/employee", {
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

export const getUsers = async () => {
  try {
    const response = await apiClient.get("users", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const createUser = async (payload) => {
  try {
    const response = await apiClient.post(`users`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const updateUser = async (id, payload) => {
  try {
    const response = await apiClient.put(`users/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating area:", error);
    throw error?.response?.data;
  }
};

export const importUser = async (payload) => {
  try {
    const response = await apiClient.post(`users/import`, payload, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const bulkActive = async (payload) => {
  try {
    const response = await apiClient.post(`users/bulk-activated`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const bulkInactive = async (payload) => {
  try {
    const response = await apiClient.post(`users/bulk-inactive`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};
