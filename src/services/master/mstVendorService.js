import { apiClient } from "../axiosInstance";

export const getVendor = async (pageIndex, pageSize, filters = {}) => {
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

    const response = await apiClient.get("vendor/", {
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

export const createVendor = async (vendorData) => {
  try {
    const response = await apiClient.post(`vendor`, [vendorData], {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating vendor:", error);
    throw error?.response?.data;
  }
};

export const updateVendor = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`vendor/${id}`, updatedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error?.response?.data;
  }
};
export const deleteVendor = async (id, deletedData) => {
  try {
    const response = await apiClient.delete(`vendor/${id}`, deletedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw error?.response?.data;
  }
};
