import { useEffect, useState } from "react";

// import { getAllQuizzes } from "../../../api/studentDashboardApi";
//
// const [fetchData, setFetchData] = useState([]);
// const [loading, setLoading] = useState(true);
//
// const getQuizzes = async () => {
//     try {
//         setLoading(true);
//         const response = await getAllQuizzes();
//         setFetchData(response?.data ?? response ?? []);
//     } catch (error) {
//         alert(error.response?.data || "Quiz Data Fetch Failed");
//         setFetchData([]);
//     } finally {
//         setLoading(false);
//     }
// };
//
// useEffect(() => {
//     getQuizzes();
// }, []);

const dummyQuizzes = [
    {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Test your understanding of variables, functions, and array methods in JavaScript.",
        difficulty: "Intermediate",
        category: "JavaScript",
        duration: 20,
        passingScore: 60,
        questions: 20,
        maxAttempts: 2,
        attemptsUsed: 0,
        status: "PUBLISHED"
    },
    {
        id: 2,
        title: "Python Basics",
        description: "Cover Python syntax, data types, loops, and basic problem solving.",
        difficulty: "Beginner",
        category: "Python",
        duration: 15,
        passingScore: 50,
        questions: 15,
        maxAttempts: 3,
        attemptsUsed: 1,
        status: "PUBLISHED"
    },
    {
        id: 3,
        title: "React Hooks Deep Dive",
        description: "Advanced questions on useState, useEffect, custom hooks, and component lifecycle.",
        difficulty: "Advanced",
        category: "React",
        duration: 35,
        passingScore: 70,
        questions: 25,
        maxAttempts: 1,
        attemptsUsed: 0,
        status: "PUBLISHED"
    },
    {
        id: 4,
        title: "Core Java Concepts",
        description: "OOP principles, collections, and exception handling in Java.",
        difficulty: "Intermediate",
        category: "Java",
        duration: 25,
        passingScore: 60,
        questions: 20,
        maxAttempts: 2,
        attemptsUsed: 2,
        status: "PUBLISHED"
    }
];

function getDifficultyStyles(difficulty) {
    switch (difficulty) {
        case "Beginner":
            return "text-blue-600";
        case "Intermediate":
            return "text-red-600";
        case "Advanced":
            return "text-violet-600";
        default:
            return "text-slate-600";
    }
}

function QuizCard({ quiz }) {
    const attemptsLeft = quiz.maxAttempts - quiz.attemptsUsed;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                            <span className="text-slate-700">{quiz.category}</span>
                            <span className="mx-1 text-slate-400">·</span>
                            <span className={getDifficultyStyles(quiz.difficulty)}>
                                {quiz.difficulty}
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
                    {attemptsLeft} / {quiz.maxAttempts} attempts left
                </span>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    disabled={attemptsLeft <= 0}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                    <i className="fa-solid fa-play" />
                    {attemptsLeft <= 0 ? "No Attempts Left" : "Start Quiz"}
                </button>
            </div>
        </article>
    );
}

function QuizList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const quizzesPerPage = 5;

    // only show quizzes that are actually published to students
    const publishedQuizzes = dummyQuizzes.filter((quiz) => quiz.status === "PUBLISHED");

    const query = searchQuery.toLowerCase().trim();

    const filteredQuizzes = query
        ? publishedQuizzes.filter((quiz) =>
            `${quiz.title} ${quiz.category} ${quiz.difficulty} ${quiz.description}`
                .toLowerCase()
                .includes(query)
        )
        : publishedQuizzes;

    const totalPages = Math.max(Math.ceil(filteredQuizzes.length / quizzesPerPage), 1);

    // go back to page 1 whenever the search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // if the current page no longer exists (e.g. after filtering), clamp it back down
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
                            onChange={(event) => setSearchQuery(event.target.value)}
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
                    {currentQuizzes.length > 0 ? (
                        currentQuizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
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

export default QuizList;