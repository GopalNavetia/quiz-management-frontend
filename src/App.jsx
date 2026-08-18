import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword />
    },
    {
        path: "/verifyOtp",
        element: <VerifyOtp />
    },
    {
        path: "/resetPassword",
        element: <ResetPassword />
    },

    {
        element: <ProtectedRoute role="ADMIN" />,
        children: [
            {
                path: "/admin/*",
                element: <AdminDashboard />
            }
        ]
    },

    {
        element: <ProtectedRoute role="STUDENT" />,
        children: [
            {
                path: "/student/*",
                element: <StudentDashboard />
            }
        ]
    }
]);

function App() {

    return <RouterProvider router={router} />;
}

export default App;