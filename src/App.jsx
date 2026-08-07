import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />
    },
    {
      path: "/student/Dashboard",
      element: <StudentDashboard />
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;