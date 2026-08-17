import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteStudent } from "../../../api/adminDashboardApi";

function UserManagement() {
    const navigate = useNavigate();

    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const studentsPerPage = 5;

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setFetchData(response?.data ?? response ?? []);
        } catch (error) {
            alert(error.response?.data || "User Data Fetch Failed");
            setFetchData([]);
        } finally {
            setLoading(false);
        }
    };

    // Run once when the page loads
    useEffect(() => {
        getUsers();
    }, []);

    // Filter students by search query (runs fresh every render — no need to cache it)
    const query = searchQuery.toLowerCase().trim();
    const filteredStudents = query
        ? fetchData.filter((student) => (student.name?.toLowerCase() || "").includes(query))
        : fetchData;

    const totalPages = Math.max(Math.ceil(filteredStudents.length / studentsPerPage), 1);

    // Whenever the search query changes, jump back to page 1
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // If the current page no longer exists
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Pagination Logic
    const startIndex = (currentPage - 1) * studentsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

    const showingStart = filteredStudents.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * studentsPerPage, filteredStudents.length);

    const handleLeftButton = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleRightButton = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getInitials = (name = "") =>
        name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("");

    const handleAddStudent = () => {
        navigate("/admin/users/add");
    }

    const handleEditStudent = (studentId) => {
        navigate(`/admin/users/edit/${studentId}`);
    }

    const handleViewStudent = (userId)=>{
        navigate(`/admin/users/${userId}`)
    }

    const handleDeleteStudent = async (studentId, studentName) => {
    const ok = window.confirm(`Are you sure you want to delete user: "${studentName}"?`);

    if (!ok) return;

    try {
        await deleteStudent(studentId);
        setFetchData((prev) => prev.filter((student) => student.id !== studentId));
    } catch (error) {
        alert(error.response?.data || "User Deletion Failed");
    }
};

    return (
        <main className="space-y-4">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">User management</h1>
                    <p className="text-xs text-slate-500">Manage all registered students.</p>
                </div>

                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs text-white"
                    onClick={handleAddStudent}
                >
                    <span className="text-sm">+</span>
                    <span className="font-semibold">Add student</span>
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
                            placeholder="Search students by name"
                            aria-label="Search students by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-11 pr-4 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {loading ? (
                        <p className="py-6 text-center text-sm text-slate-500">Loading...</p>
                    ) : currentStudents.length > 0 ? (
                        currentStudents.map((student) => (
                            <article
                                key={student.id}
                                className="rounded-2xl border border-slate-100 p-3 shadow-sm"
                            >
                                <header className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-700">
                                            {getInitials(student.name)}
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                                                {student.name}
                                            </h2>
                                            <p className="truncate text-xs text-slate-500 sm:text-sm">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${student.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-500"
                                            }`}
                                    >
                                        {student.active ? "Active" : "Inactive"}
                                    </span>
                                </header>

                                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                                            Registered
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                                            {formatDate(student.registrationDate)}
                                        </p>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                                            Attempted
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                                            {student.quizzesAttempted ?? 0}
                                        </p>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                                            Avg. score
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-green-600 sm:text-base">
                                            {student.averageScore ?? 0}%
                                        </p>
                                    </div>
                                </div>

                                <footer className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="View student"
                                        onClick={()=>handleViewStudent(student.id)}
                                    >
                                        <i className="fa-regular fa-eye" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="Edit student"
                                        onClick={() => handleEditStudent(student.id)}
                                    >
                                        <i className="fa-regular fa-pen-to-square" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="Delete student"
                                        onClick={() => handleDeleteStudent(student.id, student.name)}
                                    >
                                        <i className="fa-regular fa-trash-can" />
                                    </button>
                                </footer>
                            </article>
                        ))
                    ) : (
                        <p className="py-6 text-center text-sm text-slate-500">No students found.</p>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                        Showing {showingStart}–{showingEnd} of {filteredStudents.length} students
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

export default UserManagement;