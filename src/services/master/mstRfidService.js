import { apiClient } from "../axiosInstance";

export const getRfids = async (pageIndex, pageSize, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (pageIndex !== undefined && pageSize !== undefined) {
      params.set("page", String(pageIndex + 1));
      params.set("limit", String(pageSize));
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get("rfid/", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      params,
    });

    return {
      data: response.data.data,
      totalRecords: response.data.totalRecords,
      totalPages:
        response.data.totalPage ||
        (pageSize ? Math.ceil(response.data.totalRecords / pageSize) : 1),
    };
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const createRfid = async (rfidData) => {
  try {
    const response = await apiClient.post(`rfid`, [rfidData], {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating rfid:", error);
    throw error?.response?.data;
  }
};

export const updateRfid = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`rfid/${id}`, updatedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating rfid:", error);
    throw error?.response?.data;
  }
};
export const deleteRfid = async (id, deletedData) => {
  try {
    const response = await apiClient.delete(`rfid/${id}`, deletedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting rfid:", error);
    throw error?.response?.data;
  }
};
