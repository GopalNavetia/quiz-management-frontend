import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />
    },
    {
      path: "/student/Dashboard",
      element: (
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      )
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;