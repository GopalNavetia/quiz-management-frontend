import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ role }) {

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (role && userRole !== role) {
        alert("You do not have permission to access this page.");

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;