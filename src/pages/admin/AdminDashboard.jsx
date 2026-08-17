import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

import DashboardHome from "./dashboard/DashboardHome";
import UserManagement from "./userManagement/UserManagement";
import AddStudent from "./userManagement/AddStudent";
import EditStudent from "./userManagement/EditStudent";
import AdminManagement from "./adminManagement/AdminManagement";
import AddAdmin from "./adminManagement/AddAdmin";
import EditAdmin from "./adminManagement/EditAdmin";
import QuizManagement from "./quizManagement/QuizManagement";
import AddQuiz from "./quizManagement/AddQuiz";
import EditQuiz from "./quizManagement/EditQuiz";
import AddCategory from "./quizManagement/categoryManagement/AddCategory";
import EditCategory from "./quizManagement/categoryManagement/EditCategory";
import QuestionManagement from "./quizManagement/questionManagement/QuestionManagement";
import AddQuestion from "./quizManagement/questionManagement/AddQuestion";
import EditQuestion from "./quizManagement/questionManagement/EditQuestion";
import Leaderboard from "../../components/Leaderboard";
import History from ".././student/history/History";
import Review from ".././student/quiz/reviewQuiz/ReviewQuiz"


function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            <AdminNavbar setSidebarOpen={setSidebarOpen}/>

            <main className="flex flex-1 overflow-hidden">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="flex-1 overflow-y-auto p-4">
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />

                        <Route path="users" element={<UserManagement />} />
                        <Route path="users/:studentId" element= {<History/>} />
                        <Route path="users/:studentId/:attemptId" element= {<Review/>} />
                        <Route path="users/add" element={<AddStudent />} />
                        <Route path="users/edit/:studentId" element={<EditStudent />} />

                        <Route path="admins" element={<AdminManagement />} />
                        <Route path="admins/add" element={<AddAdmin />} />
                        <Route path="admins/edit/:adminId" element={<EditAdmin />} />

                        <Route path="quizzes" element={<QuizManagement />} />
                        <Route path="quizzes/add" element={<AddQuiz />} />
                        <Route path="quizzes/edit/:quizId" element={<EditQuiz />} />

                        <Route path="quizzes/add/addCategory" element={<AddCategory />} />
                        <Route path="quizzes/add/editCategory/:categoryId" element={<EditCategory />} />

                        <Route path="quizzes/:quizId/questions" element={<QuestionManagement />} />
                        <Route path="quizzes/:quizId/questions/addQuestion" element={<AddQuestion />} />
                        <Route path="quizzes/:quizId/questions/:quesId/editQuestion" element={<EditQuestion />} />

                        <Route path="leaderboard" element={<Leaderboard />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;