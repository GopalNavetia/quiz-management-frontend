import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEditQuiz, updateQuiz } from "../../../api/adminDashboardApi";
import CategoryDropdown from "./categoryManagement/CategoryDropdown";

function EditQuiz() {
   const [isLoading, setIsLoading] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(true);
    const navigate = useNavigate();
    const { quizId } = useParams();

    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        categoryId: "",
        difficulty: "BEGINNER",
        duration: "",
        passingScore: "",
        maxAttempts: "",
        status: "DRAFT"
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        categoryId: "",
        difficulty: "",
        duration: "",
        passingScore: "",
        maxAttempts: "",
        status: ""
    });

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoadingQuiz(true);

            try {
                const data = await getEditQuiz(quizId);

                setQuizData({
                    title: data.title ?? "",
                    description: data.description ?? "",
                    categoryId: data.categoryId ?? "",
                    difficulty: data.difficulty ?? "BEGINNER",
                    duration: data.duration ?? "",
                    passingScore: data.passingScore ?? "",
                    maxAttempts: data.maxAttempts ?? "",
                    status: data.status ?? "DRAFT"
                });
            } catch (error) {
                alert(error.response?.data || "Failed to load quiz");
                navigate(-1);
            } finally {
                setLoadingQuiz(false);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setQuizData((prev) => ({
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

        if (!quizData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!quizData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (!quizData.categoryId) {
            newErrors.categoryId = "Category is required";
        } else if (Number(quizData.categoryId) <= 0) {
            newErrors.categoryId = "Category ID must be greater than 0";
        }

        if (!quizData.difficulty) {
            newErrors.difficulty = "Difficulty is required";
        }

        if (!quizData.duration) {
            newErrors.duration = "Duration is required";
        } else if (Number(quizData.duration) <= 0) {
            newErrors.duration = "Duration must be greater than 0";
        }

        if (!quizData.passingScore) {
            newErrors.passingScore = "Passing score is required";
        } else if (
            Number(quizData.passingScore) < 0 ||
            Number(quizData.passingScore) > 100
        ) {
            newErrors.passingScore = "Passing score must be between 0 and 100";
        }

        if (!quizData.maxAttempts) {
            newErrors.maxAttempts = "Max attempts is required";
        } else if (Number(quizData.maxAttempts) <= 0) {
            newErrors.maxAttempts = "Max attempts must be greater than 0";
        }

        if (!quizData.status) {
            newErrors.status = "Status is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await updateQuiz(quizId, {
                ...quizData,
                categoryId: Number(quizData.categoryId),
                duration: Number(quizData.duration),
                passingScore: Number(quizData.passingScore),
                maxAttempts: Number(quizData.maxAttempts)
            });

            alert("Quiz updated successfully");

            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "Failed to update quiz");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setQuizData((prev) => ({
            ...prev,
            categoryId
        }));

        setErrors((prev) => ({
            ...prev,
            categoryId: ""
        }));
    };

    if (loadingQuiz) {
        return <p className="py-6 text-center text-sm text-slate-500">Loading...</p>;
    }

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quiz management</h1>
                    <p className="text-slate-500">Create and manage all available quizzes.</p>
                </div>
            </header>

            <section className="max-w-xl rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold">Edit Quiz</h2>
                <p className="mt-1 text-xs text-gray-400">Update quiz details</p>

                <form className="mt-5" onSubmit={handleSubmit} noValidate>
                    <label className="mt-3 block text-xs text-gray-700">Title</label>
                    <input
                        name="title"
                        value={quizData.title}
                        type="text"
                        placeholder="Quiz Title"
                        className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={handleChange}
                    />
                    {errors.title && (
                        <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                    )}

                    <label className="mt-3 block text-xs text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={quizData.description}
                        rows="4"
                        placeholder="Quiz Description"
                        className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={handleChange}
                    />
                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                    )}

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                            <CategoryDropdown
                                value={quizData.categoryId}
                                onChange={handleCategoryChange}
                                error={errors.categoryId}
                                onAddCategory={() => navigate("/admin/quizzes/add/addCategory")}
                                onEditCategory={(category) => {
                                    // optional: wire route when ready
                                    navigate(`/admin/quizzes/add/editCategory/${category.id}`);
                                }}
                                onDeleteCategory={(category) => {
                                    // optional: wire delete modal/api when ready
                                    console.log("Delete category:", category);
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Difficulty</label>
                            <select
                                name="difficulty"
                                value={quizData.difficulty}
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            >
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
                            </select>
                            {errors.difficulty && (
                                <p className="mt-1 text-xs text-red-500">{errors.difficulty}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs text-gray-700">Duration</label>
                            <input
                                name="duration"
                                value={quizData.duration}
                                type="number"
                                min="1"
                                placeholder="Minutes"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.duration && (
                                <p className="mt-1 text-xs text-red-500">{errors.duration}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Passing Score</label>
                            <input
                                name="passingScore"
                                value={quizData.passingScore}
                                type="number"
                                min="0"
                                max="100"
                                placeholder="%"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.passingScore && (
                                <p className="mt-1 text-xs text-red-500">{errors.passingScore}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-700">Max Attempts</label>
                            <input
                                name="maxAttempts"
                                value={quizData.maxAttempts}
                                type="number"
                                min="1"
                                placeholder="Attempts"
                                className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onChange={handleChange}
                            />
                            {errors.maxAttempts && (
                                <p className="mt-1 text-xs text-red-500">{errors.maxAttempts}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="block text-xs text-gray-700">Status</label>
                        <select
                            name="status"
                            value={quizData.status}
                            className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={handleChange}
                        >
                            <option value="DRAFT">DRAFT</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="UNPUBLISHED">UNPUBLISHED</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-xs text-red-500">{errors.status}</p>
                        )}
                    </div>

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
                            {isLoading ? "Adding..." : "Add Quiz"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default EditQuiz;