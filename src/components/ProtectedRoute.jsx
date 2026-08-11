import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ role }) {

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (role && userRole !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;