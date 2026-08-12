import { useRoutes } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import DashboardHome from "./dashboard/DashboardHome";
import UserManagement from "./userManagement/UserManagement";
import AddStudent from "./userManagement/AddStudent";
import EditStudent from "./userManagement/EditStudent";
import AdminManagement from "./adminManagement/AdminManagement";
import AddAdmin from "./adminManagement/AddAdmin";
import EditAdmin from "./adminManagement/EditAdmin";

function AdminDashboard() {
    const DashboardRoutes = () => {
        return useRoutes([
            { path: "/dashboard", element: <DashboardHome /> },
            { path: "/users", element: <UserManagement /> },
            { path: "/users/add", element: <AddStudent /> },
            { path: "/users/edit/:studentId", element: <EditStudent /> },
            { path: "/admins", element: <AdminManagement /> },
            { path: "/admins/add", element: <AddAdmin /> },
            { path: "/admins/edit/:adminId", element: <EditAdmin /> }
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