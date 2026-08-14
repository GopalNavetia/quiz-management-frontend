import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />
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