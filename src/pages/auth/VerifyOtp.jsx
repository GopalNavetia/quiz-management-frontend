import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";

function VerifyOtp() {

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/forgotPassword", { replace: true });
        }
    }, [email, navigate]);

    const handleChange = (event) => {
        setOtp(event.target.value);
        setError("");
    };

    const validate = () => {
        if (!otp.trim()) {
            setError("OTP is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await verifyOtp(email, otp);

            navigate("/resetPassword", { state: { email, otp } });

        } catch (error) {
            alert(error.response?.data || "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm border border-black/10 bg-white rounded-2xl shadow-lg">
                <div className="cursor-default px-6 py-5 text-center">
                    <h1 className="font-extrabold text-2xl">Verify OTP</h1>
                    <p className="text-gray-400 text-sm mt-1">Enter the OTP sent to {email}</p>
                </div>

                <div className="px-4 pb-6">
                    <form onSubmit={handleSubmit} noValidate>
                        <label className="text-sm text-gray-700">OTP</label>
                        <input
                            name="otp"
                            value={otp}
                            type="text"
                            placeholder="Enter OTP"
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
                            {isLoading ? "Verifying..." : "Verify"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;