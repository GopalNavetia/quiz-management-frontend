import { useRoutes } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import DashboardHome from "./DashboardHome";
import UserManagement from "./UserManagement";

function AdminDashboard() {
    const DashboardRoutes = () => {
        return useRoutes([
            { path: "/dashboard", element: <DashboardHome /> },
            { path: "/users", element: <UserManagement /> }
        ]);
    };

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            <Navbar />

            <main className="flex flex-1 overflow-hidden">
                <AdminSidebar />

                <div className="flex-1 overflow-y-auto p-4">
                    <DashboardRoutes />
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;