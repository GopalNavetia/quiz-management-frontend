import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/adminDashboardApi";

function getRankBadgeStyle(rank) {
    if (rank === 1) return "bg-amber-100 text-amber-700";
    if (rank === 2) return "bg-slate-200 text-slate-700";
    if (rank === 3) return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-600";
}

function getRankIcon(rank) {
    if (rank <= 3) return "fa-solid fa-medal";
    return null;
}

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const entriesPerPage = 5;

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                setLoading(true);
                const response = await getLeaderboard();
                const data = response?.data ?? response ?? [];
                setLeaderboard(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.response?.data || "Failed to load leaderboard");
                setLeaderboard([]);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    const totalPages = Math.max(Math.ceil(leaderboard.length / entriesPerPage), 1);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = leaderboard.slice(startIndex, startIndex + entriesPerPage);

    const showingStart = leaderboard.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * entriesPerPage, leaderboard.length);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    function goToPreviousPage() {
        setCurrentPage((page) => Math.max(page - 1, 1));
    }

    function goToNextPage() {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    }

    return (
        <main className="space-y-4">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Leaderboard</h1>
                <p className="text-xs text-slate-500">See how you rank against other students.</p>
            </header>

            <section className="rounded-2xl border bg-white p-3 shadow-sm">
                <div className="space-y-3">
                    {loading && <p className="py-6 text-center text-sm text-slate-500">Loading leaderboard...</p>}

                    {!loading && error && (
                        <p className="py-6 text-center text-sm text-rose-600">{error}</p>
                    )}

                    {!loading && !error && currentEntries.length === 0 && (
                        <p className="py-6 text-center text-sm text-slate-500">No leaderboard data found.</p>
                    )}

                    {!loading &&
                        !error &&
                        currentEntries.map((entry) => {
                            const rankIcon = getRankIcon(entry.rank);

                            return (
                                <article
                                    key={entry.studentId}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getRankBadgeStyle(
                                                entry.rank
                                            )}`}
                                        >
                                            {rankIcon ? <i className={rankIcon} /> : `#${entry.rank}`}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate text-base font-bold leading-snug text-slate-900">
                                                {entry.studentName}
                                            </h2>
                                            <p className="mt-0.5 text-xs text-slate-500">Rank #{entry.rank}</p>
                                        </div>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                                        {entry.averageScore}%
                                    </span>
                                </article>
                            );
                        })}
                </div>

                {/* Pagination controls */}
                {!loading && !error && leaderboard.length > 0 && (
                    <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500">
                            Showing {showingStart}–{showingEnd} of {leaderboard.length} students
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
                )}
            </section>
        </main>
    );
}

export default Leaderboard;