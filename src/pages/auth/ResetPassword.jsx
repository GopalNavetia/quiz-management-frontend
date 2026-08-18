import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

function ResetPassword() {

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const otp = location.state?.otp;

    const [passwordData, setPasswordData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, otp, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const errors = {};

        if (!passwordData.password.trim()) {
            errors.password = "Password is required";

        } else if (passwordData.password.trim().length < 8) {
            errors.password = "Password must be at least 8 characters";

        } else if (!/[A-Z]/.test(passwordData.password.trim()) ||
            !/[0-9]/.test(passwordData.password.trim()) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.password.trim())) {

            errors.password = "Password must include an uppercase letter (A-Z), a number (0-9), and a special character (!@#)";
        }

        if (passwordData.password !== passwordData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await resetPassword(email, otp, passwordData.password);

            alert("Password updated successfully. Please log in.");
            navigate("/", { replace: true });

        } catch (error) {
            alert(error.response?.data || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    if (!email || !otp) return null;

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm border border-black/10 bg-white rounded-2xl shadow-lg">
                <div className="cursor-default px-6 py-5 text-center">
                    <h1 className="font-extrabold text-2xl">Reset Password</h1>
                    <p className="text-gray-400 text-sm mt-1">Set a new password for your account</p>
                </div>

                <div className="px-4 pb-6">
                    <form onSubmit={handleSubmit} noValidate>
                        <label className="text-sm text-gray-700">New Password</label>
                        <input
                            name="password"
                            value={passwordData.password}
                            type="password"
                            placeholder="New Password"
                            className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}

                        <label className="text-sm text-gray-700 mt-3 block">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            type="password"
                            placeholder="Confirm Password"
                            className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white py-3 rounded-lg font-medium"
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;