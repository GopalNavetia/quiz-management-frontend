import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateCategory } from "../../../../api/adminDashboardApi";

function EditCategory() {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const location = useLocation();

    const [name, setName] = useState(location.state?.name || "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const trimmed = name.trim();

        if (!trimmed) {
            setError("Category name is required");
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            setIsLoading(true);

            await updateCategory(categoryId, { name: name.trim() });

            navigate(-1);
        } catch (err) {
            alert("Failed to update Category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-lg rounded-xl border bg-white p-4 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">Edit Category</h1>
            <p className="mt-1 text-sm text-slate-500">Update quiz category.</p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="categoryName" className="block text-xs text-gray-700">
                        Category Name
                    </label>
                    <input
                        id="categoryName"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="Enter category name"
                        className="mt-1.5 block w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                        type="button"
                        className="rounded-lg border px-4 py-2 text-sm text-slate-700"
                        onClick={() => navigate(-1)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                    >
                        {isLoading ? "Updating..." : "Update Category"}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default EditCategory;