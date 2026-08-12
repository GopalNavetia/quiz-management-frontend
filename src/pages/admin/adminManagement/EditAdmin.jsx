import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEditAdmin, updateAdmin } from "../../../api/adminDashboardApi";

function EditAdmin() {
    const { adminId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(true);
    const navigate = useNavigate();

    const [adminData, setAdminData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        active: false
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                setLoadingAdmin(true);

                const response = await getEditAdmin(adminId);

                setAdminData({
                    firstName: response.firstName || "",
                    lastName: response.lastName || "",
                    email: response.email || "",
                    active: response.active ?? true
                });
            } catch (error) {
                alert(error.response?.data || "Failed to load admin");
            } finally {
                setLoadingAdmin(false);
            }
        };

        if (adminId) {
            fetchAdmin();
        }
    }, [adminId]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setAdminData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!adminData.firstName.trim()) {
            newErrors.firstName = "First Name is required";
        }

        if (!adminData.lastName.trim()) {
            newErrors.lastName = "Last Name is required";
        }

        if (!adminData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(adminData.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await updateAdmin(adminId, adminData);

            alert("Admin updated successfully");
            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "Failed to update admin");
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingAdmin) {
        return <p className="py-6 text-center text-sm text-slate-500">Loading...</p>;
    }

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin management</h1>
                    <p className="text-slate-500">Manage and monitor all registered admins.</p>
                </div>
            </header>

            <section className="max-w-md rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold">Edit Admin</h2>
                <p className="text-gray-400 text-xs mt-1">Update admin details</p>

                <form className="mt-5" onSubmit={handleSubmit} noValidate>
                    <label className="text-xs text-gray-700">First Name</label>
                    <input
                        name="firstName"
                        value={adminData.firstName}
                        type="text"
                        placeholder="First Name"
                        className="block w-full mt-1.5 px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={handleChange}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}

                    <label className="text-xs text-gray-700 mt-3 block">Last Name</label>
                    <input
                        name="lastName"
                        value={adminData.lastName}
                        type="text"
                        placeholder="Last Name"
                        className="block w-full mt-1.5 px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={handleChange}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}

                    <label className="text-xs text-gray-700 mt-3 block">Email</label>
                    <input
                        name="email"
                        value={adminData.email}
                        type="email"
                        placeholder="Email"
                        className="block w-full mt-1.5 px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}

                    <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-gray-700">
                        <input
                            type="checkbox"
                            name="active"
                            checked={adminData.active}
                            onChange={handleChange}
                            className="h-4 w-4 cursor-pointer"
                        />
                        Active
                    </label>

                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            type="button"
                            className="w-full cursor-pointer px-4 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-700"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white rounded-lg font-medium"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default EditAdmin;