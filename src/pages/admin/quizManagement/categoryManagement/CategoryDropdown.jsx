import { useEffect, useState } from "react";
import { getAllCategory } from "../../../../api/adminDashboardApi";

function CategoryDropdown({
    value,
    onChange,
    error = "",
    onAddCategory,
    onEditCategory,
    onDeleteCategory
}) {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getAllCategory();
                const data = response?.data ?? response ?? [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const selectedCategory =
        categories.find((c) => String(c.id) === String(value)) || null;

    const handleSelect = (category) => {
        onChange?.(String(category.id));
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="block text-xs text-gray-700">Category</label>

            <button
                type="button"
                className="mt-1.5 flex w-full items-center justify-between rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-300"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="truncate">
                    {loading ? "Loading categories..." : selectedCategory?.name || "Select Category"}
                </span>
                <i className={`fa-solid ${isOpen ? "fa-angle-up" : "fa-angle-down"} text-gray-500`} />
            </button>

            {isOpen && (
                <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border bg-white shadow-lg">
                    {categories.length > 0 ? (
                        <>
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between gap-2 border-b px-3 py-2 last:border-b-0 hover:bg-slate-50"
                                >
                                    <button
                                        type="button"
                                        className="min-w-0 flex-1 truncate text-left text-sm text-slate-800"
                                        onClick={() => handleSelect(category)}
                                        title={category.name}
                                    >
                                        {category.name}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            aria-label={`Edit ${category.name}`}
                                            className="text-slate-500 hover:text-indigo-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditCategory?.(category);
                                            }}
                                        >
                                            <i className="fa-regular fa-pen-to-square" />
                                        </button>

                                        <button
                                            type="button"
                                            aria-label={`Delete ${category.name}`}
                                            className="text-slate-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteCategory?.(category);
                                            }}
                                        >
                                            <i className="fa-regular fa-trash-can" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                                onClick={() => {
                                    setIsOpen(false);
                                    onAddCategory?.();
                                }}
                            >
                                <span className="text-base leading-none">+</span>
                                <span>Add category</span>
                            </button>
                        </>
                    ) : (
                        <div className="px-3 py-3 text-sm text-slate-500">No categories found</div>
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default CategoryDropdown;