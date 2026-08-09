import api from "./axiosInstance";

export const loginUser = (loginData) => {
    return api.post("/auth/login", loginData);
}

export const registerUser = (registerData) => {
    return api.post("/auth/register", registerData);
};