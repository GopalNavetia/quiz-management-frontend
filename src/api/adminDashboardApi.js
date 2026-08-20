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

export const updateStudent = async (studentId, studentData) => {
    const response = await api.put(`/admin/users/updateStudent/${studentId}`, studentData);
    return response.data;
}

export const deleteStudent = async (studentId) => {
    const response = await api.delete(`/admin/users/deleteStudent/${studentId}`);
    return response.data;
}

export const getQuizHistoryAdmin = async (studentId)=>{
    const response = await api.get(`/admin/quizHistory/${studentId}`);
    return response.data;
}

export const getReviewAdmin= async (studentId,attemptId)=>{
    const response=await api.get(`/admin/users/${studentId}/history/${attemptId}`);
    return response.data;
}

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

export const deleteAdmin = async (adminId) => {
    const response = await api.delete(`/admin/adminsList/deleteAdmin/${adminId}`);
    return response.data;
}

// Category Management API
export const getAllCategory = async () => {
    const response = await api.get("/category/categoryList");
    return response.data;
}

export const addCategory = async (categoryData) => {
    const response = await api.post("/category/addCategory", categoryData);
    return response.data;   
}

export const updateCategory = async (categoryId, categoryData) => {
    const response = await api.put(`/category/categoryList/updateCategory/${categoryId}`, categoryData);
    return response.data;
}

export const deleteCategory = async (categoryId) => {
    const response = await api.delete(`/category/categoryList/deleteCategory/${categoryId}`);
    return response.data;
}

// Quiz Management API
export const getAllQuizzes = async () => {
    const response = await api.get("/admin/quizzes/quizzesList");
    return response.data;
}

export const addQuiz = async (quizData) => {
    const response = await api.post("/admin/quizzes/create", quizData);
    return response.data;
}

export const getEditQuiz = async (quizId) => {
    const response = await api.get(`/admin/quizzes/quizzesList/getEditQuiz/${quizId}`);
    return response.data;
}

export const updateQuiz = async (quizId, quizData) => {
    const response = await api.put(`/admin/quizzes/quizzesList/updateQuiz/${quizId}`, quizData);
    return response.data;
}

export const deleteQuiz = async (quizId)=>{
    const response = await api.delete(`/admin/quizzes/deleteQuiz/${quizId}`);
    return response.data;
}

// Question Management API
export const getAllQuestions = async (quizId) => {
    const response = await api.get(`/admin/question/questionList/${quizId}`);
    return response.data;
}

export const addQuestion = async (QuestionData) => {
    const response = await api.post("/admin/question/addQuestion", QuestionData);
    return response.data;
}

export const getEditQuestion = async (quizId, questionId) => {
    const response = await api.get(`/admin/question/questionList/${quizId}/getEditQuestion/${questionId}`);
    return response.data;
}

export const updateQuestion = async (quizId,questionId,questionData) => {
    const response = await api.put(`/admin/question/questionList/${quizId}/updateQuestion/${questionId}`, questionData);
    return response.data;
}

export const deleteQuestion = async (quesId) => {
    const response = await api.delete(`/admin/question/deleteQuestion/${quesId}`);
    return response.data;
}

export const getLeaderboard = async () => {
    const response = await api.get("/leaderboard");
    return response.data;
} 

