import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import StudentNavbar from "../../components/StudentNavbar";
import StudentSidebar from "../../components/StudentSidebar";

import DashboardHome from "./dashboard/DashboardHome";
import Quiz from "./quiz/Quiz";

import History from "./history/History";

import Leaderboard from "../../components/Leaderboard";
import AttemptQuizWindow from "./quiz/attemptQuiz/AttemptQuizWindow";

function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            <StudentNavbar setSidebarOpen={setSidebarOpen} />
            <main className="flex flex-1 overflow-hidden">
                <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="flex-1 overflow-y-auto p-4">
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />

                        <Route path="quizzes" element={<Quiz />} />

                        <Route path="history" element={<History />} />

                        <Route path="leaderboard" element={<Leaderboard />} />

                        {/* <Route path="users/add" element={<AddStudent />} /> */}
                        {/* <Route path="users/edit/:studentId" element={<EditStudent />} /> */}

                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;