import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/authApi";

function AddStudent() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [studentData, setStudentData] = useState({
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

        setStudentData((prev) => ({
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

        if (!studentData.firstName.trim()) {
            newErrors.firstName = "First Name is required";
        }

        if (!studentData.lastName.trim()) {
            newErrors.lastName = "Last Name is required";
        }

        if (!studentData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(studentData.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!studentData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (studentData.password.trim().length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (
            !/[A-Z]/.test(studentData.password.trim()) ||
            !/[0-9]/.test(studentData.password.trim()) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(studentData.password.trim())
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
            await registerUser(studentData);

            alert("Student added successfully");

            setStudentData({
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
            alert(error.response?.data || "Failed to add student");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User management</h1>
                    <p className="text-slate-500">Manage and monitor all registered students.</p>
                </div>
            </header>

            <section className="max-w-md rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold">Add Student</h2>
                <p className="text-gray-400 text-xs mt-1">Create a new student account</p>

                <form className="mt-5" onSubmit={handleSubmit} noValidate>
                    <label className="text-xs text-gray-700">First Name</label>
                    <input
                        name="firstName"
                        value={studentData.firstName}
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
                        value={studentData.lastName}
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
                        value={studentData.email}
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
                        value={studentData.password}
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
                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-700"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white rounded-lg font-medium"
                        >
                            {isLoading ? "Adding..." : "Add Student"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default AddStudent;