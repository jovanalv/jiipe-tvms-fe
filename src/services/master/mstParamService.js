import { apiClient, apiPublic } from "../axiosInstance";

export const getEvacStats = async () => {
  try {
    const response = await apiClient.get(`evac-stats`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getEmgList = async () => {
  try {
    const response = await apiClient.get(`emg-list`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getApinTypeList = async () => {
  try {
    const response = await apiClient.get(`apin-type`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getChangeCardReason = async () => {
  try {
    const response = await apiClient.get(`change-card-reason`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getContractorTypes = async () => {
  try {
    const response = await apiClient.get(`contractor-types`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getEMGRoles = async () => {
  try {
    const response = await apiClient.get(`emg-roles`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getGateStats = async () => {
  try {
    const response = await apiClient.get(`gate-stats`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getCardStatus = async () => {
  try {
    const response = await apiClient.get(`card-status`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getPersonTypes = async () => {
  try {
    const response = await apiClient.get(`pers-types`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getVisitorStats = async () => {
  try {
    const response = await apiClient.get(`visitor-stats`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const testMSURLApi = async (payload) => {
  try {
    const response = await apiClient.post(`set_param/ms-test-url`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getMaxPrintContractor = async () => {
  try {
    const response = await apiPublic.get(`max-print-contractor`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getMaxPrintVisitor = async () => {
  try {
    const response = await apiPublic.get(`max-print-visitor`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getCtrExpDate = async (ctype) => {
  try {
    const response = await apiClient.get(`ctr-exp-date/${ctype}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getLastEvacUndefinedMinute = async () => {
  try {
    const response = await apiClient.get(`last-evac-undefined-minute`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getCtrExpDateLeftWarning = async () => {
  try {
    const response = await apiClient.get(`ctr-exp-date-left`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const getGateType = async () => {
  try {
    const response = await apiClient.get(`gate-type`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};
