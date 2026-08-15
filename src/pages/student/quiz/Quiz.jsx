import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentQuizzes } from "../../../api/studentDashboardApi";
import { startQuiz } from "../../../api/studentDashboardApi";


function getDifficultyColor(difficulty) {
    const level = difficulty?.toUpperCase();
    if (level === "BEGINNER") return "text-blue-600";
    if (level === "INTERMEDIATE") return "text-red-600";
    if (level === "ADVANCED") return "text-violet-600";
    return "text-slate-600";
}

function formatDifficulty(difficulty) {
    if (!difficulty) return "Unrated";
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}

function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // State to hold the selected quiz ID for the start confirmation modal
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    const quizzesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                setLoading(true);
                const response = await getStudentQuizzes();
                const data = response?.data ?? response ?? [];
                setQuizzes(Array.isArray(data) ? data : []);
            } catch (error) {
                alert("Failed to load quizzes");
                setQuizzes([]);
            } finally {
                setLoading(false);
            }
        }
        fetchQuizzes();
    }, []);

    const query = searchQuery.toLowerCase().trim();
    const filteredQuizzes = quizzes.filter((quiz) => {
        if (!query) return true;
        const text = `${quiz.title} ${quiz.categoryName} ${quiz.difficulty} ${quiz.description}`.toLowerCase();
        return text.includes(query);
    });

    const totalPages = Math.max(Math.ceil(filteredQuizzes.length / quizzesPerPage), 1);
    const startIndex = (currentPage - 1) * quizzesPerPage;
    const currentQuizzes = filteredQuizzes.slice(startIndex, startIndex + quizzesPerPage);

    const showingStart = filteredQuizzes.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * quizzesPerPage, filteredQuizzes.length);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Open confirmation modal
    function handleOpenConfirmModal(quizId) {
        setSelectedQuizId(quizId);
    }

    // Close confirmation modal
    function handleCloseModal() {
        setSelectedQuizId(null);
    }

    async function handleConfirmStart() {
        if (!selectedQuizId) return;

        try {
            const response = await startQuiz(selectedQuizId);
            console.log("Start quiz response:", response);
            const attemptId = response?.attemptId ?? response?.data?.attemptId;

            if (attemptId) {
                localStorage.setItem("attemptId", attemptId);
            }

            navigate(`${selectedQuizId}`);
        } catch (error) {
            alert(error.response?.data || "Failed to start quiz");
        }
    }

    function goToPreviousPage() {
        setCurrentPage((page) => Math.max(page - 1, 1));
    }

    function goToNextPage() {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    }

    return (
        <main className="space-y-4">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Quizzes</h1>
                <p className="text-xs text-slate-500">Browse and attempt available quizzes.</p>
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
                    {loading && <p className="py-6 text-center text-sm text-slate-500">Loading quizzes...</p>}

                    {!loading && currentQuizzes.length === 0 && (
                        <p className="py-6 text-center text-sm text-slate-500">No quizzes found.</p>
                    )}

                    {!loading &&
                        currentQuizzes.map((quiz) => {
                            const maxAttempts = quiz.maxAttempts ?? 1;
                            const attemptsUsed = quiz.attemptsUsed ?? 0;
                            const attemptsLeft = maxAttempts - attemptsUsed;
                            const canStart = attemptsLeft > 0;

                            return (
                                <article key={quiz.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                                                    <span className="text-slate-700">{quiz.categoryName || "General"}</span>
                                                    <span className="mx-1 text-slate-400">·</span>
                                                    <span className={getDifficultyColor(quiz.difficulty)}>
                                                        {formatDifficulty(quiz.difficulty)}
                                                    </span>
                                                </p>

                                                <p className="mt-1.5 text-sm text-slate-500">{quiz.description}</p>
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
                                            <span>{quiz.questions} questions</span>
                                        </span>

                                        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 sm:px-3 sm:text-sm">
                                            {attemptsLeft} / {maxAttempts} attempts left
                                        </span>
                                    </div>

                                    <div className="mt-4 border-t border-slate-100 pt-3">
                                        <button
                                            type="button"
                                            disabled={!canStart}
                                            onClick={() => handleOpenConfirmModal(quiz.id)}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                        >
                                            <i className="fa-solid fa-play" />
                                            {canStart ? "Start Quiz" : "No Attempts Left"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                </div>

                {/* Pagination controls */}
                <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                        Showing {showingStart}–{showingEnd} of {filteredQuizzes.length} quizzes
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

            {/* Confirmation Modal */}
            {selectedQuizId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <i className="fa-solid fa-triangle-exclamation text-xl" />
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="text-lg font-bold text-slate-900">Start Quiz Confirmation</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Once you start the test, you <strong className="text-slate-700">cannot pause</strong> or freeze the timer. Are you sure you are ready to begin?
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmStart}
                                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Confirm & Start
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default QuizList;