import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { getQuizHistory } from "../../../api/studentDashboardApi";
import { getQuizHistoryAdmin } from "../../../api/adminDashboardApi";

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getResultBadgeStyle(result) {
    if (result === "PASSED") {
        return "bg-emerald-50 text-emerald-700";
    }
    if (result === "FAILED") {
        return "bg-rose-50 text-rose-700";
    }
    return "bg-slate-100 text-slate-600";
}

function History() {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const attemptsPerPage = 5;

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await getQuizHistory();
            const data = response?.data ?? response ?? [];
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data || "Failed to load quiz history");
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const { studentId } = useParams();

    const adminFetchHistory = async () => {
        try {
            setLoading(true);
            const response = await getQuizHistoryAdmin(studentId);
            const data = response?.data ?? response ?? [];
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data || "Failed to load quiz history");
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const CURR_ROLE = localStorage.getItem("role");

        if (CURR_ROLE === "STUDENT") {

            fetchHistory();
        } else {
            adminFetchHistory();
        }
    }, []);

    const totalPages = Math.max(Math.ceil(history.length / attemptsPerPage), 1);
    const startIndex = (currentPage - 1) * attemptsPerPage;
    const currentAttempts = history.slice(startIndex, startIndex + attemptsPerPage);

    const showingStart = history.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * attemptsPerPage, history.length);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const CURR_ROLE=localStorage.getItem("role");
    const handleViewReview = (attemptId, quizId) => {
        localStorage.setItem("attemptId", attemptId);
        if(CURR_ROLE==="STUDENT"){
            navigate(`/student/quizzes/${quizId}/reviewPage/${attemptId}`);
        }else{
            navigate(`/admin/users/${studentId}/${attemptId}`);
        }
    };

    function goToPreviousPage() {
        setCurrentPage((page) => Math.max(page - 1, 1));
    }

    function goToNextPage() {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    }

    if (loading) {
        return (
            <main className="space-y-4">
                <p className="text-center text-sm text-slate-500">Loading history...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="space-y-4">
                <p className="text-center text-sm text-rose-600">{error}</p>
            </main>
        );
    }

    if (history.length === 0) {
        return (
            <main className="space-y-4">
                <header>
                    <h1 className="text-xl font-bold text-slate-900">Quiz History</h1>
                    <p className="text-xs text-slate-500">Review your past quiz attempts.</p>
                </header>

                <section className="rounded-2xl border bg-white p-3 shadow-sm">
                    <p className="py-6 text-center text-sm text-slate-500">No quiz attempts yet.</p>
                </section>
            </main>
        );
    }

    return (
        <main className="space-y-4">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Quiz History</h1>
                <p className="text-xs text-slate-500">Review your past quiz attempts.</p>
            </header>

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
                <div className="space-y-3">
                    {currentAttempts.map((attempt) => (
                        <button
                            key={attempt.attemptId}
                            type="button"
                            onClick={(attemptId, quizId) => handleViewReview(attempt.attemptId, attempt.quizId)}
                            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 hover:bg-slate-50"
                        >
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-bold text-slate-900">
                                    {attempt.quizTitle}
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {formatDate(attempt.completedAt)}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700">
                                    {attempt.percentage}%
                                </span>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getResultBadgeStyle(
                                        attempt.result
                                    )}`}
                                >
                                    {attempt.result}
                                </span>
                                <i className="fa-solid fa-chevron-right text-xs text-slate-400" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Pagination controls */}
                <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                        Showing {showingStart}–{showingEnd} of {history.length} attempts
                    </p>

                    <div className="pagination">
                        <p className="flex items-center gap-3 text-sm text-slate-600">
                            <span
                                className="cursor-pointer rounded-full border px-2 py-1"
                                onClick={goToPreviousPage}
                                role="button"
                                tabIndex={0}
                            >
                                <i className="fa-solid fa-angle-left" />
                            </span>

                            <span>
                                Showing Page {currentPage} out of {totalPages}
                            </span>

                            <span
                                className="cursor-pointer rounded-full border px-2 py-1"
                                onClick={goToNextPage}
                                role="button"
                                tabIndex={0}
                            >
                                <i className="fa-solid fa-angle-right" />
                            </span>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default History;