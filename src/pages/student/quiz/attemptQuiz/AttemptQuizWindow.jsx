import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizQuestions, submitQuiz } from "../../../../api/studentDashboardApi";

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${paddedSeconds}`;
}

// converts optionA-D fields on a question into a simple options array
function mapQuestion(question) {
    return {
        id: question.questionId,
        text: question.questionText,
        marks: question.marks,
        difficulty: question.difficulty,
        options: [
            { key: "optionA", label: question.optionA },
            { key: "optionB", label: question.optionB },
            { key: "optionC", label: question.optionC },
            { key: "optionD", label: question.optionD }
        ]
    };
}

function AttemptQuizWindow() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quizTitle, setQuizTitle] = useState("");
    const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showPalette, setShowPalette] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await getQuizQuestions(quizId);
            const data = response?.data ?? response ?? {};

            setQuizTitle(data.title ?? "Quiz");
            // duration comes in minutes from the API; timer is static for now
            setTotalTimeInSeconds((data.duration ?? 0) * 60);
            setQuestions((data.questions ?? []).map(mapQuestion));
            setCurrentIndex(0);
            setSelectedAnswers({});
        } catch (error) {
            alert(error.response?.data || "Failed to load quiz questions");
            setQuizTitle("");
            setTotalTimeInSeconds(0);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [quizId]);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;

    const handleSelectOption = (questionId, optionKey) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    };

    const handleJumpToQuestion = (index) => {
        setCurrentIndex(index);
        setShowPalette(false);
    };

    const handleSubmit = async () => {
        const answeredCount = Object.keys(selectedAnswers).length;
        const confirmSubmit = window.confirm(
            `You have answered ${answeredCount} of ${totalQuestions} questions. Submit quiz now?`
        );

        if (!confirmSubmit) return;

        const attemptId = localStorage.getItem("attemptId");

        const answers = Object.entries(selectedAnswers).map(([questionId, optionKey]) => ({
            questionId: Number(questionId),
            selectedOption: optionKey.replace("option", "")
        }));

        const submitData = {
            attemptId: attemptId ? Number(attemptId) : null,
            answers
        };

        try {
            setSubmitting(true);
            await submitQuiz(submitData);
            
            // Clear attemptId from localStorage after successful submission
            localStorage.removeItem("attemptId");

            const targetAttemptId = attemptId || "";
            navigate(`/student/quizzes/${quizId}/reviewPage/${targetAttemptId}`, { replace: true });
        } catch (error) {
            alert(error.response?.data || "Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    };

    const getPaletteButtonStyle = (questionId, index) => {
        if (index === currentIndex) {
            return "border-2 border-indigo-600 bg-white text-indigo-600";
        }
        if (selectedAnswers[questionId]) {
            return "border border-indigo-600 bg-indigo-600 text-white";
        }
        return "border border-slate-300 bg-white text-slate-600";
    };

    if (loading) {
        return (
            <main className="space-y-4">
                <p className="text-center text-sm text-slate-500">Loading quiz...</p>
            </main>
        );
    }

    if (!currentQuestion) {
        return (
            <main className="space-y-4">
                <p className="text-center text-sm text-slate-500">No questions found for this quiz.</p>
            </main>
        );
    }

    return (
        <main className="space-y-4">
            <header className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">{quizTitle}</h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Question {currentIndex + 1} of {totalQuestions}
                        </p>
                    </div>

                    {/* timer is static for now, not counting down */}
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-600">
                        <i className="fa-regular fa-clock" />
                        <span>{formatTime(totalTimeInSeconds)}</span>
                    </div>
                </div>

                {/* progress bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </header>

            {/* Question palette */}
            <section className="rounded-2xl border bg-white p-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => setShowPalette((prev) => !prev)}
                    className="flex w-full items-center justify-between text-sm font-semibold text-slate-700"
                >
                    <span>Question Palette</span>
                    <i className={`fa-solid fa-chevron-${showPalette ? "up" : "down"} text-xs`} />
                </button>

                {showPalette && (
                    <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                            {questions.map((question, index) => (
                                <button
                                    key={question.id}
                                    type="button"
                                    onClick={() => handleJumpToQuestion(index)}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${getPaletteButtonStyle(question.id, index)}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-indigo-600" />
                                Answered
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
                                Not Answered
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-sm border-2 border-indigo-600 bg-white" />
                                Current
                            </span>
                        </div>
                    </div>
                )}
            </section>

            {/* Current question */}
            <section className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Question {currentIndex + 1}</p>
                <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                    {currentQuestion.text}
                </h2>

                <div className="mt-4 space-y-2.5">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswers[currentQuestion.id] === option.key;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => handleSelectOption(currentQuestion.id, option.key)}
                                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm ${
                                    isSelected
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <span
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                        isSelected ? "border-indigo-600" : "border-slate-300"
                                    }`}
                                >
                                    {isSelected && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
                                </span>
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Previous / Next */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <i className="fa-solid fa-arrow-left" />
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === totalQuestions - 1}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                    <i className="fa-solid fa-arrow-right" />
                </button>
            </div>

            {/* Submit */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <i className="fa-solid fa-paper-plane" />
                {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
        </main>
    );
}

export default AttemptQuizWindow;