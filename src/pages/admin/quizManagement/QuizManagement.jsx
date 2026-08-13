import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuizzes } from "../../../api/adminDashboardApi";

function QuizManagement() {
    const navigate = useNavigate();

    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const quizzesPerPage = 5;

    const getQuizzes = async () => {
        try {
            setLoading(true);
            const response = await getAllQuizzes();
            setFetchData(response?.data ?? response ?? []);
        } catch (error) {
            alert(error.response?.data || "Quiz Data Fetch Failed");
            setFetchData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuizzes();
    }, []);

    const query = searchQuery.toLowerCase().trim();

    const filteredQuizzes = query
        ? fetchData.filter((quiz) =>
            `${quiz.title || ""} ${quiz.categoryName || ""} ${quiz.difficulty || ""}`
                .toLowerCase()
                .includes(query)
        )
        : fetchData;

    const totalPages = Math.max(Math.ceil(filteredQuizzes.length / quizzesPerPage), 1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startIndex = (currentPage - 1) * quizzesPerPage;
    const currentQuizzes = filteredQuizzes.slice(startIndex, startIndex + quizzesPerPage);

    const showingStart = filteredQuizzes.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * quizzesPerPage, filteredQuizzes.length);

    const handleLeftButton = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleRightButton = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const formatStatus = (status) => {
        if (!status) return "-";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const formatDifficulty = (difficulty) => {
        if (!difficulty) return "-";
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-emerald-100 text-emerald-700";
            case "DRAFT":
                return "bg-slate-100 text-slate-600";
            case "UNPUBLISHED":
                return "bg-amber-100 text-amber-700";
            default:
                return "bg-slate-100 text-slate-500";
        }
    };

    const getDifficultyStyles = (difficulty) => {
        switch (difficulty) {
            case "BEGINNER":
                return "text-blue-600";
            case "INTERMEDIATE":
                return "text-red-600";
            case "ADVANCED":
                return "text-violet-600";
            default:
                return "text-slate-600";
        }
    };

    const handleAddQuiz = () => {
        navigate("/admin/quizzes/add");
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/admin/quizzes/edit/${quizId}`);
    };

    return (
        <main className="space-y-4">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Quiz management</h1>
                    <p className="text-xs text-slate-500">Manage all available quizzes.</p>
                </div>

                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs text-white"
                    onClick={handleAddQuiz}
                >
                    <span className="text-sm">+</span>
                    <span className="font-semibold">Add quiz</span>
                </button>
            </header>

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
                <div className="space-y-3">
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <i className="fa-solid fa-magnifying-glass" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search quizzes by title"
                            aria-label="Search quizzes by title"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-11 pr-4 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
                    >
                        <i className="fa-solid fa-filter" />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {loading ? (
                        <p className="py-6 text-center text-sm text-slate-500">Loading...</p>
                    ) : currentQuizzes.length > 0 ? (
                        currentQuizzes.map((quiz) => (
                            <article
                                key={quiz.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                            <i className="fa-solid fa-book text-lg" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="wrap-break-word text-base font-bold leading-snug text-slate-900 sm:text-xl">
                                                {quiz.title}
                                            </h2>

                                            <p className="mt-1 truncate text-sm sm:text-base">
                                                <span className="text-slate-700">{quiz.categoryName}</span>
                                                <span className="mx-1 text-slate-400">·</span>
                                                <span className={getDifficultyStyles(quiz.difficulty)}>
                                                    {formatDifficulty(quiz.difficulty)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-clock" />
                                        <span>{quiz.duration} min</span>
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-circle-check" />
                                        <span>{quiz.passingScore}% to pass</span>
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-rectangle-list" />
                                        <span>{quiz.maxAttempts} attempts</span>
                                    </span>

                                    <span
                                        className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${getStatusStyles(quiz.status)}`}
                                    >
                                        {formatStatus(quiz.status)}
                                    </span>
                                </div>

                                <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="View quiz"
                                    >
                                        <i className="fa-regular fa-eye" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="Edit quiz"
                                        onClick={() => handleEditQuiz(quiz.id)}
                                    >
                                        <i className="fa-regular fa-pen-to-square" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="Delete quiz"
                                    >
                                        <i className="fa-regular fa-trash-can" />
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="py-6 text-center text-sm text-slate-500">No quizzes found.</p>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                        Showing {showingStart}–{showingEnd} of {filteredQuizzes.length} quizzes
                    </p>

                    <div className="pagination">
                        <p className="flex items-center gap-3 text-sm text-slate-600">
                            <span
                                className="cursor-pointer rounded-full border px-2 py-1"
                                onClick={handleLeftButton}
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
                                onClick={handleRightButton}
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

export default QuizManagement;