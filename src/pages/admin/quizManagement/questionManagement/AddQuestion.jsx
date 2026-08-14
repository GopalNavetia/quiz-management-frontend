import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addQuestion } from "../../../../api/adminDashboardApi"; // Adjust import path as needed

function AddQuestion() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { quizId } = useParams();

    const [questionData, setQuestionData] = useState({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        explanation: "",
        marks: "",
        difficulty: "EASY"
    });

    const [errors, setErrors] = useState({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        explanation: "",
        marks: "",
        difficulty: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setQuestionData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!questionData.questionText.trim()) {
            newErrors.questionText = "Question text is required";
        }

        if (!questionData.optionA.trim()) {
            newErrors.optionA = "Option A is required";
        }

        if (!questionData.optionB.trim()) {
            newErrors.optionB = "Option B is required";
        }

        if (!questionData.optionC.trim()) {
            newErrors.optionC = "Option C is required";
        }

        if (!questionData.optionD.trim()) {
            newErrors.optionD = "Option D is required";
        }

        if (!questionData.correctAnswer) {
            newErrors.correctAnswer = "Correct answer choice is required";
        }

        if (!questionData.marks) {
            newErrors.marks = "Marks are required";
        } else if (Number(questionData.marks) <= 0) {
            newErrors.marks = "Marks must be greater than 0";
        }

        if (!questionData.difficulty) {
            newErrors.difficulty = "Difficulty is required";
        }

        if (!questionData.explanation.trim()) {
            newErrors.explanation = "Explanation is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await addQuestion({
                ...questionData,
                quizId,
            });

            alert("Question added successfully");

            setQuestionData({
                questionText: "",
                optionA: "",
                optionB: "",
                optionC: "",
                optionD: "",
                correctAnswer: "A",
                explanation: "",
                marks: "",
                difficulty: "EASY"
            });

            setErrors({});

            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "Failed to add question");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Question Management</h1>
                    <p className="text-slate-500">Create and manage questions for quizzes.</p>
                </div>
            </header>

            <section className="max-w-xl rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold">Add Question</h2>
                <p className="mt-1 text-xs text-gray-400">Create a new question for this quiz</p>

                <form className="mt-5" onSubmit={handleSubmit} noValidate>
                    {/* Question Text */}
                    <div className="mt-3">
                        <label className="block text-xs text-gray-700">Question Text</label>
                        <textarea
                            name="questionText"
                            value={questionData.questionText}
                            rows="3"
                            placeholder="Enter the question..."
                            className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                        {errors.questionText && (
                            <p className="mt-1 text-xs text-red-500">{errors.questionText}</p>
                        )}
                    </div>

                    {/* Options Grid */}
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs text-gray-700">Option A</label>
                            <input
                                name="optionA"
                                value={questionData.optionA}
                                type="text"
                                placeholder="Option A"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.optionA && (
                                <p className="mt-1 text-xs text-red-500">{errors.optionA}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Option B</label>
                            <input
                                name="optionB"
                                value={questionData.optionB}
                                type="text"
                                placeholder="Option B"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.optionB && (
                                <p className="mt-1 text-xs text-red-500">{errors.optionB}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Option C</label>
                            <input
                                name="optionC"
                                value={questionData.optionC}
                                type="text"
                                placeholder="Option C"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.optionC && (
                                <p className="mt-1 text-xs text-red-500">{errors.optionC}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Option D</label>
                            <input
                                name="optionD"
                                value={questionData.optionD}
                                type="text"
                                placeholder="Option D"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.optionD && (
                                <p className="mt-1 text-xs text-red-500">{errors.optionD}</p>
                            )}
                        </div>
                    </div>

                    {/* Correct Answer and Marks */}
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs text-gray-700">Correct Answer</label>
                            <select
                                name="correctAnswer"
                                value={questionData.correctAnswer}
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            >
                                <option value="A">Option A</option>
                                <option value="B">Option B</option>
                                <option value="C">Option C</option>
                                <option value="D">Option D</option>
                            </select>
                            {errors.correctAnswer && (
                                <p className="mt-1 text-xs text-red-500">{errors.correctAnswer}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Marks</label>
                            <input
                                name="marks"
                                value={questionData.marks}
                                type="number"
                                min="1"
                                placeholder="Marks"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.marks && (
                                <p className="mt-1 text-xs text-red-500">{errors.marks}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Difficulty</label>
                            <select
                                name="difficulty"
                                value={questionData.difficulty}
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            >
                                <option value="EASY">EASY</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HARD">HARD</option>
                            </select>
                            {errors.difficulty && (
                                <p className="mt-1 text-xs text-red-500">{errors.difficulty}</p>
                            )}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="mt-3">
                        <label className="block text-xs text-gray-700">Explanation</label>
                        <textarea
                            name="explanation"
                            value={questionData.explanation}
                            rows="2"
                            placeholder="Explanation of correct answer..."
                            className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                        {errors.explanation && (
                            <p className="mt-1 text-xs text-red-500">{errors.explanation}</p>
                        )}
                    </div>

                    {/* Submit Actions */}
                    <div className="mt-5 flex flex-col gap-2">
                        <button
                            type="button"
                            className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Adding..." : "Add Question"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default AddQuestion;