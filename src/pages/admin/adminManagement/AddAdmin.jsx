import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAdmin } from "../../../api/adminDashboardApi";

function AddAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [adminData, setAdminData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setAdminData((prev) => ({
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

        if (!adminData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (adminData.password.trim().length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (
            !/[A-Z]/.test(adminData.password.trim()) ||
            !/[0-9]/.test(adminData.password.trim()) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(adminData.password.trim())
        ) {
            newErrors.password =
                "Password must include an uppercase letter (A-Z), a number (0-9), and a special character (!@#)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await addAdmin(adminData);

            alert("Admin added successfully");

            setAdminData({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

            setErrors({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

            navigate(-1);
        } catch (error) {
            alert(error.response?.data || "Failed to add admin");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin management</h1>
                    <p className="text-slate-500">Manage and monitor all registered admins.</p>
                </div>
            </header>

            <section className="max-w-md rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold">Add Admin</h2>
                <p className="text-gray-400 text-xs mt-1">Create a new admin account</p>

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

                    <label className="text-xs text-gray-700 mt-3 block">Password</label>
                    <input
                        name="password"
                        value={adminData.password}
                        type="password"
                        placeholder="Password"
                        className="block w-full mt-1.5 px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}

                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            type="button"
                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-700 cursor-pointer"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white rounded-lg font-medium"
                        >
                            {isLoading ? "Adding..." : "Add Admin"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default AddAdmin;