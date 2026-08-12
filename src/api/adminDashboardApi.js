import api from "./axiosInstance";

export const getAdminDashboard = async () => {
    const response = await api.get("/admin/dashboard"); 
    return response.data;
};

// User Management API
export const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
}

export const addStudent = async (studentData) => {
    const response = await api.post("/admin/users/addStudent", studentData);
    return response.data;
}

export const getEditStudent = async (studentId) => {
    const response = await api.get(`/admin/users/getEditStudent/${studentId}`);
    return response.data;
}

export const updateStudent= async (studentId, studentData) => {
    const response = await api.put(`/admin/users/updateStudent/${studentId}`, studentData);
    return response.data;
}

// Delete api pending

// Admin Management API
export const getAllAdmins = async () => {
    const response = await api.get("/admin/adminsList");
    return response.data;
}

export const addAdmin = async (adminData) => {
    const response = await api.post("/admin/adminsList/addAdmin", adminData);
    return response.data;
}

export const getEditAdmin = async (adminId) => {
    const response = await api.get(`/admin/adminsList/getEditAdmin/${adminId}`);
    return response.data;
}

export const updateAdmin = async (adminId, adminData) => {
    const response = await api.put(`/admin/adminsList/updateAdmin/${adminId}`, adminData);
    return response.data;
}