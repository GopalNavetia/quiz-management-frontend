import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllQuestions } from "../../../../api/adminDashboardApi"; 

function QuestionManagement() {
    const navigate = useNavigate();
    const { quizId,quesId } = useParams(); // Retrieves quizId from route params if available

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Tracks which question IDs have their answers expanded
    const [expandedAnswers, setExpandedAnswers] = useState({});

    const questionsPerPage = 5;

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await getAllQuestions(quizId);
            setQuestions(response?.data ?? response ?? []);
        } catch (error) {
            alert(error.response?.data || "Question Data Fetch Failed");
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (quizId) {
            fetchQuestions();
        }
    }, [quizId]);

    const totalPages = Math.max(Math.ceil(questions.length / questionsPerPage), 1);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startIndex = (currentPage - 1) * questionsPerPage;
    const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

    const showingStart = questions.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * questionsPerPage, questions.length);

    const handleLeftButton = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleRightButton = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const formatDifficulty = (difficulty) => {
        if (!difficulty) return "-";
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    };

    const getDifficultyStyles = (difficulty) => {
        switch (difficulty?.toUpperCase()) {
            case "EASY":
                return "text-blue-600";
            case "MEDIUM":
                return "text-red-600";
            case "HARD":
                return "text-violet-600";
            default:
                return "text-slate-600";
        }
    };

    const toggleAnswerVisibility = (id) => {
        setExpandedAnswers((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleAddQuestion = () => {
        navigate(`addQuestion`);
    };

    const handleEditQuestion = (quesId) => {
        navigate(`${quesId}/editQuestion`);
    };

    return (
        <main className="space-y-4">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Question Management</h1>
                    <p className="text-xs text-slate-500">Manage all questions for this quiz.</p>
                </div>

                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs text-white"
                    onClick={handleAddQuestion}
                >
                    <span className="text-sm">+</span>
                    <span className="font-semibold">Add Question</span>
                </button>
            </header>

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
                <div className="mt-2 space-y-3">
                    {loading ? (
                        <p className="py-6 text-center text-sm text-slate-500">Loading...</p>
                    ) : currentQuestions.length > 0 ? (
                        currentQuestions.map((q) => {
                            const isAnswerVisible = expandedAnswers[q.id];

                            return (
                                <article
                                    key={q.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                                <i className="fa-solid fa-circle-question text-lg" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h2 className="wrap-break-word text-base font-bold leading-snug text-slate-900 sm:text-xl">
                                                    {q.questionText}
                                                </h2>

                                                <p className="mt-1 truncate text-sm sm:text-base">
                                                    <span className="font-medium text-slate-700">
                                                        Marks: {q.marks}
                                                    </span>
                                                    <span className="mx-1 text-slate-400">·</span>
                                                    <span className={getDifficultyStyles(q.difficulty)}>
                                                        {formatDifficulty(q.difficulty)}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options Grid */}
                                    <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                                            <span className="font-bold text-slate-900">A.</span> {q.optionA}
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                                            <span className="font-bold text-slate-900">B.</span> {q.optionB}
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                                            <span className="font-bold text-slate-900">C.</span> {q.optionC}
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                                            <span className="font-bold text-slate-900">D.</span> {q.optionD}
                                        </div>
                                    </div>

                                    {/* Toggle Check Answer */}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleAnswerVisibility(q.id)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            <i className={`fa-solid ${isAnswerVisible ? "fa-eye-slash" : "fa-eye"}`} />
                                            <span>{isAnswerVisible ? "Hide Answer" : "Check Answer"}</span>
                                        </button>

                                        {isAnswerVisible && (
                                            <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 border border-emerald-200">
                                                <p className="font-bold">
                                                    Correct Answer: Option {q.correctAnswer}
                                                </p>
                                                {q.explanation && (
                                                    <p className="mt-1 text-xs text-emerald-800">
                                                        <span className="font-semibold">Explanation:</span> {q.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                        <button
                                            type="button"
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            aria-label="Edit question"
                                            onClick={() => handleEditQuestion(q.id)}
                                        >
                                            <i className="fa-regular fa-pen-to-square" />
                                        </button>
                                        <button
                                            type="button"
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            aria-label="Delete question"
                                        >
                                            <i className="fa-regular fa-trash-can" />
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <p className="py-6 text-center text-sm text-slate-500">No questions found.</p>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                        Showing {showingStart}–{showingEnd} of {questions.length} questions
                    </p>

                    <div className="pagination">
                        <p className="flex items-center gap-3 text-sm text-slate-600">
                            <span
                                className="cursor-pointer rounded-full border px-2 py-1 select-none"
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
                                className="cursor-pointer rounded-full border px-2 py-1 select-none"
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

export default QuestionManagement;