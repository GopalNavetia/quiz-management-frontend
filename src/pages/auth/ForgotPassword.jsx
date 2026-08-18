import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setEmail(event.target.value);
        setError("");
    };

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            setError("Email is required");
            return false;
        }

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await forgotPassword(email);

            navigate("/verifyOtp", { state: { email } });

        } catch (error) {
            alert(error.response?.data || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm border border-black/10 bg-white rounded-2xl shadow-lg">
                <div className="cursor-default px-6 py-5 text-center">
                    <h1 className="font-extrabold text-2xl">Forgot Password</h1>
                    <p className="text-gray-400 text-sm mt-1">Enter your email to receive an OTP</p>
                </div>

                <div className="px-4 pb-6">
                    <form onSubmit={handleSubmit} noValidate>
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            name="email"
                            value={email}
                            type="email"
                            placeholder="Email"
                            className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white py-3 rounded-lg font-medium"
                        >
                            {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;