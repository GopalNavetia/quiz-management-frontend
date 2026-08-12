import { useEffect, useState } from "react";
import AdminDashboardCard from "../../../components/AdminDashboardCard";
import { getAdminDashboard } from "../../../api/adminDashboardApi";

function DashboardHome() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const response = await getAdminDashboard();
            setDashboard(response);

        } catch (error) {
            alert(error.response?.data || "Dashboard Data Fetch Failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <>
            {loading ? (
                <div className="flex h-full items-center justify-center">
                    <p className="text-lg font-medium text-gray-600">
                        Loading dashboard...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <AdminDashboardCard icon="fa-regular fa-user" data={dashboard.totalStudents} title="Total students" />
                    <AdminDashboardCard icon="fa-regular fa-file-lines" data={dashboard.totalQuizzes} title="Total quizzes" />
                    <AdminDashboardCard icon="fa-regular fa-circle-check" data={dashboard.publishedQuizzes} title="Published quizzes" />
                    <AdminDashboardCard icon="fa-regular fa-pen-to-square" data={dashboard.draftQuizzes} title="Draft quizzes" />
                    <AdminDashboardCard icon="fa-regular fa-circle-question" data={dashboard.totalQuestions} title="Total questions" />
                    <AdminDashboardCard icon="fa-solid fa-wave-square" data={dashboard.totalQuizAttempts} title="Total quiz attempts" />
                    <AdminDashboardCard icon="fa-solid fa-chart-simple" data={`${dashboard.averageScore}%`} title="Average score" />
                    <AdminDashboardCard icon="fa-solid fa-check" data={dashboard.passedAttempts} title="Total passed attempts" />
                    <AdminDashboardCard icon="fa-solid fa-xmark" data={dashboard.failedAttempts} title="Total failed attempts" />
                </div>
            )}
        </>
    );
}

export default DashboardHome;