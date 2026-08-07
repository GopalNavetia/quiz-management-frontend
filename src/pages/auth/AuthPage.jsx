import { useState } from "react";

function AuthPage() {

    const [role, setRole] = useState("student");
    const [authType, setAuthType] = useState("login");

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm border border-black/10 bg-white rounded-2xl shadow-lg">
                <div className="px-6 py-5 text-center">
                    <h1 className="font-extrabold text-2xl">Quiz Management System</h1>
                    <p className="text-gray-400 text-sm mt-1">Log in or create a student account</p>
                </div>

                <div className="px-4 pb-4">
                    <div className="flex bg-gray-200 rounded-full p-1 gap-1">
                        <button
                            onClick={() => { setRole("student"); setAuthType("login"); }}
                            className={`flex-1 text-sm py-2 rounded-full font-medium ${role === "student" ? "bg-black text-white" : "text-gray-600"}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => { setRole("admin"); setAuthType("login"); }}
                            className={`flex-1 text-sm py-2 rounded-full font-medium ${role === "admin" ? "bg-black text-white" : "text-gray-600"}`}
                        >
                            Admin
                        </button>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center gap-6 border-b pb-3">
                            <button
                                onClick={() => setAuthType("login")}
                                className={`text-sm font-semibold ${authType === "login" ? "text-black border-b-2 border-indigo-600 pb-1" : "text-gray-400"}`}
                            >
                                Log in
                            </button>
                            {role === "student" && (
                                <button
                                    onClick={() => setAuthType("register")}
                                    className={`text-sm font-semibold ${authType === "register" ? "text-black border-b-2 border-indigo-600 pb-1" : "text-gray-400"}`}
                                >
                                    Register
                                </button>
                            )}
                        </div>

                        <form className="mt-4">
                            {authType === "login" ? (
                                <div>
                                    <label className="text-sm text-gray-700">Email</label>
                                    <input id="login-email" name="email" type="email" placeholder="Email" required
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <label className="text-sm text-gray-700 mt-3 block">Password</label>
                                    <input id="login-password" name="password" type="password" placeholder="Password" required
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <div className="text-right mt-2">
                                        <button type="button" className="text-indigo-600 text-sm">Forgot password?</button>
                                    </div>

                                    <button type="submit" className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium">Log in</button>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm text-gray-700">First Name</label>
                                    <input id="first-name" name="firstName" type="text" placeholder="First Name" required
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <label className="text-sm text-gray-700 mt-3 block">Last Name</label>
                                    <input id="last-name" name="lastName" type="text" placeholder="Last Name"
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <label className="text-sm text-gray-700 mt-3 block">Email</label>
                                    <input id="register-email" name="email" type="email" placeholder="Email" required
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <label className="text-sm text-gray-700 mt-3 block">Password</label>
                                    <input id="register-password" name="password" type="password" placeholder="Password" required
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <label className="text-sm text-gray-700 mt-3 block">Confirm Password</label>
                                    <input id="confirm-password" name="confirmPassword" type="password" placeholder="Confirm Password" required
                                        className="block w-full mt-2 px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                                    <button type="submit" className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium">Create account</button>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="text-center text-gray-500 text-sm mt-4">
                        {role === "student"
                            ? <>Don't have an account? <button className="text-indigo-600 font-medium" onClick={() => setAuthType("register")}>Register</button></>
                            : "Admin accounts are created by the system administrator."}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;