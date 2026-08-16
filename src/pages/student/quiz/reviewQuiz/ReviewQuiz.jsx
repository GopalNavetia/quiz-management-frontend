import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizReview } from "../../../../api/studentDashboardApi";

const optionKeys = ["A", "B", "C", "D"];

function getOptionLabel(question, key) {
    return question[`option${key}`];
}

function getOptionStyle(question, key) {
    const isCorrectOption = question.correctAnswer === key;
    const isSelectedOption = question.selectedAnswer === key;

    if (isCorrectOption) {
        return "border-emerald-600 bg-emerald-50 text-emerald-700";
    }
    if (isSelectedOption && !question.isCorrect) {
        return "border-rose-600 bg-rose-50 text-rose-700";
    }
    return "border-slate-200 text-slate-600";
}

function ReviewQuiz() {
    // ✅ Extract attemptId at the top level of the component
    const { attemptId } = useParams();

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReview = async () => {
            if (!attemptId) {
                setError("No attempt found. Please attempt the quiz first.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getQuizReview(attemptId);
                setReview(response?.data ?? response ?? null);
            } catch (err) {
                setError(err.response?.data || "Failed to load quiz review");
                setReview(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [attemptId]);

    if (loading) {
        return (
            <main className="space-y-4">
                <p className="text-center text-sm text-slate-500">Loading review...</p>
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

    if (!review) {
        return (
            <main className="space-y-4">
                <p className="text-center text-sm text-slate-500">No review data found.</p>
            </main>
        );
    }

    const { quizTitle, score, percentage, questions = [] } = review;
    const totalQuestions = questions.length;
    const correctCount = questions.filter((q) => q.isCorrect).length;

    return (
        <main className="space-y-4">
            {/* Summary */}
            <header className="rounded-2xl border bg-white p-4 shadow-sm">
                <h1 className="text-lg font-bold text-slate-900">{quizTitle}</h1>
                <p className="mt-0.5 text-xs text-slate-500">Quiz Review</p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-center">
                        <p className="text-lg font-bold text-indigo-700">{score}</p>
                        <p className="text-xs font-medium text-indigo-600">Score</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 text-center">
                        <p className="text-lg font-bold text-emerald-700">{percentage}%</p>
                        <p className="text-xs font-medium text-emerald-600">Percentage</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                        <p className="text-lg font-bold text-slate-700">
                            {correctCount}/{totalQuestions}
                        </p>
                        <p className="text-xs font-medium text-slate-500">Correct</p>
                    </div>
                </div>
            </header>

            {/* Questions */}
            <section className="space-y-3">
                {questions.map((question, index) => (
                    <div key={question.questionId} className="rounded-2xl border bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-500">Question {index + 1}</p>
                        </div>

                        <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                            {question.questionText}
                        </h2>

                        <div className="mt-4 space-y-2.5">
                            {optionKeys.map((key) => {
                                const label = getOptionLabel(question, key);
                                const isCorrectOption = question.correctAnswer === key;
                                const isSelectedOption = question.selectedAnswer === key;

                                return (
                                    <div
                                        key={key}
                                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${getOptionStyle(
                                            question,
                                            key
                                        )}`}
                                    >
                                        <span>{label}</span>
                                        <div className="flex shrink-0 items-center gap-2">
                                            {isSelectedOption && (
                                                <span className="text-xs font-semibold uppercase tracking-wide">
                                                    Your answer
                                                </span>
                                            )}
                                            {isCorrectOption && (
                                                <i className="fa-solid fa-check text-emerald-600" />
                                            )}
                                            {isSelectedOption && !isCorrectOption && (
                                                <i className="fa-solid fa-xmark text-rose-600" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {question.explanation && (
                            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                                <p className="font-semibold text-slate-700">Explanation</p>
                                <p className="mt-0.5">{question.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
}

export default ReviewQuiz;