import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getQuizQuestions } from "../../../api/studentDashboardApi";
//
// const { quizId } = useParams();
// const [questions, setQuestions] = useState([]);
// const [loading, setLoading] = useState(true);
//
// const fetchQuestions = async () => {
//     try {
//         setLoading(true);
//         const response = await getQuizQuestions(quizId);
//         setQuestions(response?.data ?? response ?? []);
//     } catch (error) {
//         alert(error.response?.data || "Failed to load quiz questions");
//         setQuestions([]);
//     } finally {
//         setLoading(false);
//     }
// };
//
// useEffect(() => {
//     fetchQuestions();
// }, [quizId]);

const quizTitle = "JavaScript Fundamentals";
const totalTimeInSeconds = 20 * 60; 

const dummyQuestions = [
    { id: 1, text: "Which symbol is used for strict equality in JavaScript?", options: ["=", "==", "===", "!=="] },
    { id: 2, text: "Which method adds an item to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"] },
    { id: 3, text: "Which keyword declares a constant?", options: ["var", "let", "const", "static"] },
    { id: 4, text: "What does 'NaN' stand for?", options: ["Not a Number", "New and Null", "Null and None", "Number and Null"] },
    { id: 5, text: "Which method converts a JSON string into a JS object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"] },
    { id: 6, text: "Which keyword is used to create a function?", options: ["func", "def", "function", "lambda"] },
    { id: 7, text: "What is the output of typeof null?", options: ["'null'", "'object'", "'undefined'", "'number'"] },
    { id: 8, text: "Which array method creates a new array with results of calling a function?", options: ["forEach()", "map()", "filter()", "reduce()"] }
];

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${paddedSeconds}`;
}

function AttemptQuizWindow() {
    const questions = dummyQuestions;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
    const [showPalette, setShowPalette] = useState(false);

    // countdown timer - ticks down every second
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;

    const handleSelectOption = (questionId, option) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: option
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

    const handleSubmit = () => {
        const answeredCount = Object.keys(selectedAnswers).length;
        const confirmSubmit = window.confirm(
            `You have answered ${answeredCount} of ${totalQuestions} questions. Submit quiz now?`
        );

        if (confirmSubmit) {
            alert("Quiz submitted!");
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

                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-600">
                        <i className="fa-regular fa-clock" />
                        <span>{formatTime(timeLeft)}</span>
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
                        const isSelected = selectedAnswers[currentQuestion.id] === option;

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSelectOption(currentQuestion.id, option)}
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
                                <span>{option}</span>
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
                <i className="fa-solid fa-paper-plane" />
                Submit Quiz
            </button>
        </main>
    );
}

export default AttemptQuizWindow;