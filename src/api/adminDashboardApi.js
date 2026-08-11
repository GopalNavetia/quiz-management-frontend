import api from "./axiosInstance";

export const getAdminDashboard = async () => {
    const response = await api.get("/admin/dashboard"); 
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
}