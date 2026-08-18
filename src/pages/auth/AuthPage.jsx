import { useState } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function AuthPage() {

    const [role, setRole] = useState("student");
    const [authType, setAuthType] = useState("login");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) return;

        if (role === "ADMIN") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/student/dashboard", { replace: true });
        }

    }, [navigate]);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        role: "STUDENT"
    });

    useEffect(() => {
        setLoginData((prev) => ({
            ...prev,
            role: role.toUpperCase()
        }));
    }, [role]);

    const [loginErrors, setLoginErrors] = useState({
        email: "",
        password: ""
    });

    const [registerData, setRegisterData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [registerErrors, setRegisterErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    // Common Login Input Handler
    const handleLoginChange = (event) => {
        const { name, value } = event.target;

        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))

        setLoginErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    }

    // Validate Login
    const validateLogin = () => {
        const errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Email Validation
        if (!loginData.email.trim()) {
            errors.email = "Email is required";

        } else if (!emailRegex.test(loginData.email.trim())) {
            errors.email = "Please enter a valid email address.";
        }

        // Password Validation
        if (!loginData.password.trim()) {
            errors.password = "Password is required";

        }

        setLoginErrors(errors);

        return Object.keys(errors).length === 0;
    }

    // Handle Login Submit
    const handleLoginSubmit = async (event) => {

        event.preventDefault();

        if (!validateLogin()) {
            return;
        }

        setIsLoading(true);

        try {

            const response = await loginUser(loginData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("lastName", response.data.lastName);

            // Role Based Navigation
            if (response.data.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }

            setLoginData({
                email: "",
                password: ""
            });

            setLoginErrors({
                email: "",
                password: ""
            });

        } catch (error) {

            alert(error.response?.data || "Login Failed");

        } finally {

            setIsLoading(false);

        }
    };

    // Common Register Input Handler
    const handleRegisterChange = (event) => {
        const { name, value } = event.target;

        setRegisterData(prev => ({
            ...prev, [name]: value
        }))

        setRegisterErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    }

    // Validate Register
    const validateRegister = () => {

        const errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!registerData.firstName.trim()) {
            errors.firstName = "First Name is required";

        }

        if (!registerData.lastName.trim()) {
            errors.lastName = "Last Name is required";

        }

        if (!registerData.email.trim()) {
            errors.email = "Email is required";

        } else if (!emailRegex.test(registerData.email.trim())) {
            errors.email = "Please enter a valid email address.";

        }

        if (!registerData.password.trim()) {
            errors.password = "Password is required";

        } else if (registerData.password.trim().length < 8) {
            errors.password = "Password must be at least 8 characters";

        } else if (!/[A-Z]/.test(registerData.password.trim()) ||
            !/[0-9]/.test(registerData.password.trim()) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(registerData.password.trim())) {

            errors.password = "Password must include an uppercase letter (A-Z), a number (0-9), and a special character (!@#)";

        }

        if (registerData.password !== registerData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";

        }

        setRegisterErrors(errors);

        return Object.keys(errors).length === 0;
    }

    // Handle Register Submit
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();

        if (!validateRegister()) {
            return;
        }


        setIsLoading(true);

        try {

            const response = await registerUser(registerData);

            alert("Registration Successful");
            setAuthType("login");

            setRegisterData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setRegisterErrors({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setLoginData({
                email: "",
                password: ""
            });

            setLoginErrors({
                email: "",
                password: ""
            });

        } catch (error) {

            alert(error.response?.data || "Something went wrong");

        } finally {

            setIsLoading(false);

        }
    }

    const handleForgotPassword = () => {
        navigate("/forgotPassword");
    }

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm border border-black/10 bg-white rounded-2xl shadow-lg">
                {/* Header */}
                <div className="cursor-default px-6 py-5 text-center">
                    <h1 className="font-extrabold text-2xl">Quiz Management System</h1>
                    <p className="text-gray-400 text-sm mt-1">Log in or create a student account</p>
                </div>

                {/* Role */}
                <div className="px-4 pb-4">
                    <div className="flex bg-gray-200 rounded-full p-1 gap-1">
                        <button
                            onClick={() => { setRole("student"); setAuthType("login"); }}
                            className={`flex-1 cursor-pointer text-sm py-2 rounded-full font-medium ${role === "student" ? "bg-black text-white" : "text-gray-600"}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => { setRole("admin"); setAuthType("login"); }}
                            className={`flex-1 cursor-pointer text-sm py-2 rounded-full font-medium ${role === "admin" ? "bg-black text-white" : "text-gray-600"}`}
                        >
                            Admin
                        </button>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center gap-6 border-b pb-3">
                            <button
                                onClick={() => setAuthType("login")}
                                className={`cursor-pointer text-sm font-semibold ${authType === "login" ? "text-black border-b-2 border-indigo-600 pb-1" : "text-gray-400"}`}
                            >
                                Log in
                            </button>
                            {role === "student" && (
                                <button
                                    onClick={() => setAuthType("register")}
                                    className={`cursor-pointer text-sm font-semibold ${authType === "register" ? "text-black border-b-2 border-indigo-600 pb-1" : "text-gray-400"}`}
                                >
                                    Register
                                </button>
                            )}
                        </div>

                        {authType === "login" ? (
                            // Login Form
                            <form className="mt-4" onSubmit={handleLoginSubmit} noValidate>
                                <div>
                                    <label className="text-sm text-gray-700">Email</label>
                                    <input id="login-email" name="email" value={loginData.email} type="email" placeholder="Email"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleLoginChange} />
                                    {/* Email Validation */}
                                    {loginErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {loginErrors.email}
                                        </p>
                                    )}

                                    <label className="text-sm text-gray-700 mt-3 block">Password</label>
                                    <input id="login-password" name="password" value={loginData.password} type="password" placeholder="Password"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleLoginChange} />
                                    {/* Password Validation */}
                                    {loginErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {loginErrors.password}
                                        </p>
                                    )}

                                    <div className="text-right mt-2">
                                        <button type="button" className="cursor-pointer text-indigo-600 text-sm" onClick={()=>handleForgotPassword()}>Forgot password?</button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-4 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white py-3 rounded-lg font-medium" >
                                        {isLoading ? "Logging in..." : "Log in"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Register Form
                            <form className="mt-4" onSubmit={handleRegisterSubmit} noValidate>
                                <div>
                                    <label className="text-sm text-gray-700">First Name</label>
                                    <input id="first-name" name="firstName" value={registerData.firstName} type="text" placeholder="First Name"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleRegisterChange} />
                                    {/* First Validation */}
                                    {registerErrors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {registerErrors.firstName}
                                        </p>
                                    )}

                                    <label className="text-sm text-gray-700 mt-3 block">Last Name</label>
                                    <input id="last-name" name="lastName" value={registerData.lastName} type="text" placeholder="Last Name"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleRegisterChange} />
                                    {/* Last Validation */}
                                    {registerErrors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {registerErrors.lastName}
                                        </p>
                                    )}

                                    <label className="text-sm text-gray-700 mt-3 block">Email</label>
                                    <input id="register-email" name="email" value={registerData.email} type="email" placeholder="Email"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleRegisterChange} />
                                    {/* Email Validation */}
                                    {registerErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {registerErrors.email}
                                        </p>
                                    )}

                                    <label className="text-sm text-gray-700 mt-3 block">Password</label>
                                    <input id="register-password" name="password" value={registerData.password} type="password" placeholder="Password"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleRegisterChange} />
                                    {/* Password Validation */}
                                    {registerErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {registerErrors.password}
                                        </p>
                                    )}

                                    <label className="text-sm text-gray-700 mt-3 block">Confirm Password</label>
                                    <input id="confirm-password" name="confirmPassword" value={registerData.confirmPassword} type="password" placeholder="Confirm Password"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        onChange={handleRegisterChange} />
                                    {/* Confirm Password Validation */}
                                    {registerErrors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {registerErrors.confirmPassword}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-4 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 bg-indigo-600 text-white py-3 rounded-lg font-medium">
                                        {isLoading ? "Creating account..." : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="text-center text-gray-500 text-sm mt-4">
                        {role === "student" ? (
                            authType === "login" ? (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        className="cursor-pointer text-indigo-600 font-medium"
                                        onClick={() => setAuthType("register")}
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="cursor-pointer text-indigo-600 font-medium"
                                        onClick={() => setAuthType("login")}
                                    >
                                        Log in
                                    </button>
                                </>
                            )
                        ) : (
                            "Admin accounts are created by the system administrator."
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;