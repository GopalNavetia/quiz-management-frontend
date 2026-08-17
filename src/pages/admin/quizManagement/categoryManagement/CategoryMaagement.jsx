import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../../../../api/adminDashboardApi";

function CategoryMaagement() {
    const navigate = useNavigate();

    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const categoriesPerPage = 6;

    const getCategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCategory();
            setFetchData(response?.data ?? response ?? []);
        } catch (error) {
            alert(error.response?.data || "Category Data Fetch Failed");
            setFetchData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const query = searchQuery.toLowerCase().trim();
    const filteredCategories = query
        ? fetchData.filter((category) => (category?.name || "").toLowerCase().includes(query))
        : fetchData;

    const totalPages = Math.max(Math.ceil(filteredCategories.length / categoriesPerPage), 1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startIndex = (currentPage - 1) * categoriesPerPage;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + categoriesPerPage);

    const showingStart = filteredCategories.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(currentPage * categoriesPerPage, filteredCategories.length);

    const handleLeftButton = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const handleRightButton = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const handleAddCategory = () => navigate("/admin/categories/add");

    const handleEditCategory = (categoryId) => navigate(`/admin/categories/edit/${categoryId}`);

    const handleDeleteCategory = (categoryId, categoryName) => {
         const ok = window.confirm(`Are you sure you want to delete category: ${categoryName}?`);
             
                     if (!ok) return;
             
                     try {
                         await deleteCategory(categoryId);
                         setFetchData((prev) => prev.filter((category) => category.id !== categoryId));
                     } catch (error) {
                         alert(error.response?.data || "Category Deletion Failed");
                     }
    }

    // Auto icon by keyword matching in category name
    const getCategoryIcon = (name = "") => {
        const n = name.toLowerCase();

        const keywordIconMap = [
            { keys: ["java"], icon: "fa-brands fa-java" },
            { keys: ["python"], icon: "fa-brands fa-python" },
            { keys: ["react"], icon: "fa-brands fa-react" },
            { keys: ["javascript", "js"], icon: "fa-brands fa-js" },
            { keys: ["html"], icon: "fa-brands fa-html5" },
            { keys: ["css"], icon: "fa-brands fa-css3-alt" },
            { keys: ["database", "mysql", "sql", "postgres", "mongo"], icon: "fa-solid fa-database" },
            { keys: ["network"], icon: "fa-solid fa-network-wired" },
            { keys: ["cyber", "security"], icon: "fa-solid fa-shield-halved" },
            { keys: ["spring"], icon: "fa-solid fa-leaf" },
            { keys: ["c++", "c#"], icon: "fa-solid fa-code" },
        ];

        const found = keywordIconMap.find((item) => item.keys.some((k) => n.includes(k)));
        return found?.icon || "fa-solid fa-folder-open";
    };

    return (
        <main className="space-y-4">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Category management</h1>
                    <p className="text-xs text-slate-500">Manage all quiz categories.</p>
                </div>

                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs text-white"
                    onClick={handleAddCategory}
                >
                    <span className="text-sm">+</span>
                    <span className="font-semibold">Add category</span>
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
                            placeholder="Search categories by name"
                            aria-label="Search categories by name"
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
                    {loading ? (
                        <p className="py-6 text-center text-sm text-slate-500">Loading...</p>
                    ) : currentCategories.length > 0 ? (
                        currentCategories.map((category) => (
                            <article
                                key={category.id}
                                className="rounded-2xl border border-slate-100 p-3 shadow-sm"
                            >
                                <header className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                            <i className={`${getCategoryIcon(category.name)} text-lg`} />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                                                {category.name}
                                            </h2>
                                            <p className="truncate text-xs text-slate-500 sm:text-sm">
                                                {category.quizzesCount ?? 0} quizzes
                                            </p>
                                        </div>
                                    </div>
                                </header>

                                <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
                                    <div className="min-w-0">
                                        <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                                            Total quizzes
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                                            {category.quizzesCount ?? 0}
                                        </p>
                                    </div>
                                </div>

                                <footer className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="View category"
                                    >
                                        <i className="fa-regular fa-eye" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="Edit category"
                                        onClick={() => handleEditCategory(category.id)}
                                    >
                                        <i className="fa-regular fa-pen-to-square" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                                        aria-label="Delete category"
                                        onClick={() => handleDeleteCategory(category.id, category.name)}
                                    >
                                        <i className="fa-regular fa-trash-can" />
                                    </button>
                                </footer>
                            </article>
                        ))
                    ) : (
                        <p className="py-6 text-center text-sm text-slate-500">No categories found.</p>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                        Showing {showingStart}–{showingEnd} of {filteredCategories.length} categories
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

export default CategoryMaagement;