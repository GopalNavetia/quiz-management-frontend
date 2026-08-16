import { useEffect, useState } from "react";
import AdminDashboardCard from "../../../components/AdminDashboardCard";
import { getStudentDashboard } from "../../../api/studentDashboardApi";

function DashboardHome() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const response = await getStudentDashboard();
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
        <main className="space-y-4">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">My Dashboard</h1>
                    <p className="text-xs text-slate-500">Your quiz performance and recent attempts overview.</p>
                </div>
            </header>

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-lg font-medium text-gray-600">
                            Loading dashboard...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <AdminDashboardCard icon="fa-regular fa-file-lines" data={dashboard.quizzesAttempted} title="Quizzes attempted" />
                        <AdminDashboardCard icon="fa-solid fa-chart-simple" data={`${dashboard.averageScore.toFixed(2)}%`} title="Average score" />
                        <AdminDashboardCard icon="fa-solid fa-trophy" data={`${dashboard.highestScore.toFixed(2)}%`} title="Highest score" />
                        <AdminDashboardCard icon="fa-regular fa-circle-check" data={dashboard.passed} title="Passed" />
                        <AdminDashboardCard icon="fa-solid fa-xmark" data={dashboard.failed} title="Failed" />
                    </div>
                )}
            </section>

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-900">Recent Attempts</h2>

                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-lg font-medium text-gray-600">
                            Loading dashboard...
                        </p>
                    </div>
                ) : dashboard.recentAttempts.length === 0 ? (
                    <p className="text-sm text-slate-500">No attempts yet.</p>
                ) : (
                    <div className="space-y-2">
                        {dashboard.recentAttempts.map((attempt) => (
                            <div
                                key={attempt.attemptId}
                                className="flex items-center justify-between gap-3 rounded-xl border p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                            attempt.result === "PASSED"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                        <i
                                            className={
                                                attempt.result === "PASSED"
                                                    ? "fa-regular fa-circle-check"
                                                    : "fa-solid fa-xmark"
                                            }
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {attempt.quizTitle}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Score: {attempt.percentage.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        attempt.result === "PASSED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {attempt.result}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default DashboardHome;