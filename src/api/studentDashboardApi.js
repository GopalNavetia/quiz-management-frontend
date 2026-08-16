import api from "./axiosInstance";

//Student Dashboard API
export const getStudentDashboard = async () => {
    const response = await api.get("/student/dashboard");
    return response.data;
}

// Student Quiz API
export const getStudentQuizzes = async () => {
    const response = await api.get("/student/quizzes");
    return response.data;
}

export const startQuiz = async (quizId) => {
    const response = await api.post(`/student/startQuizAttempt/${quizId}`);
    return response.data;
}

export const getQuizQuestions = async (quizId) => {
    const response = await api.get(`/student/question/getQuestion/${quizId}`);
    return response.data;
}

export const submitQuiz = async (submitData) => {
    const response = await api.post(`/student/submitQuiz`, submitData);
    return response.data;
}

export const getQuizReview = async (attemptId) => {
    const response = await api.get(`student/review/${attemptId}`);
    return response.data;
}

export const getQuizHistory = async () => {
    const response = await api.get(`/student/quizHistory`);
    return response.data;
}