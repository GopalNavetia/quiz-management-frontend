import api from "./axiosInstance";

export const loginUser = (loginData) => {
    return api.post("/auth/login", loginData);
}

export const registerUser = (registerData) => {
    return api.post("/auth/register", registerData);
};

export const forgotPassword = (email) => {
    return api.post("/auth/forgotPassword", { email });
}

export const verifyOtp = (email, otp) => {
    return api.post("/auth/verifyOtp", { email, otp });
}

export const resetPassword = (email, otp, password) => {
    return api.post("/auth/resetPassword", { email, otp, password });
}