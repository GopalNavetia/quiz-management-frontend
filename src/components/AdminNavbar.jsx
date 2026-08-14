import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

function AdminNavbar({ setSidebarOpen }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoutButton = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        navigate("/");
    }

    const handleManageAdminButton = () => {
        setMenuOpen(false);
        navigate("/admin/admins");
    }

    return (
        <nav className="flex items-center justify-between bg-black px-2 py-2 text-white shadow-md">
            {/* Left side */}
            <div className={"flex items center"}>
                <div className="flex items-center justify-between px-1 py-4 pr-2">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="cursor-pointer text-white"
                        aria-label="Toggle sidebar"
                    >
                        <i className="fa-solid fa-sliders text-xl text-white" />
                    </button>
                </div>

                <div className="flex items-center gap-3 cursor-default">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold sm:h-12 sm:w-12 sm:text-2xl sm:pb-1 cursor-default">
                        Q
                    </div>

                    <div className="leading-tight cursor-default">
                        <h1 className="text-lg font-bold sm:text-2xl cursor-default">Admin Dashboard</h1>
                        <p className="text-xs text-gray-300 sm:block sm:text-sm cursor-default">
                            Quiz Management System
                        </p>
                    </div>
                </div>
            </div>


            {/* Right side */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1a1a1a] px-2.5 py-2 transition-colors duration-200 hover:bg-[#232323] sm:px-4"
                    aria-expanded={menuOpen}
                    aria-label="Open user menu"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-base font-bold pb-0.5 sm:h-12 sm:w-12 sm:text-lg">
                        {localStorage.getItem("firstName").charAt(0)}{localStorage.getItem("lastName").charAt(0)}
                    </div>

                    <div className="hidden leading-tight text-left sm:block">
                        <h2 className="text-base font-semibold sm:text-lg">{localStorage.getItem("firstName")} {localStorage.getItem("lastName")}</h2>
                        <p className="text-xs text-gray-300 sm:text-sm">Administrator</p>
                    </div>

                    <span
                        className={`text-xs text-gray-300 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>
                        <i className="fa-solid fa-chevron-down" />
                    </span>
                </button>

                {/* Click dropdown */}
                {menuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-46 rounded-2xl bg-white p-2 text-gray-900 shadow-xl">
                        <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-1 text-left text-base transition-colors hover:bg-gray-100"
                            onClick={handleManageAdminButton}
                        >
                            <span className="text-sm text-gray-500">
                                <i className="fa-solid fa-gear" />
                            </span>
                            <span>Manage admin</span>
                        </button>

                        <div className="my-1 border-t border-gray-200" />

                        <button
                            type="button"
                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-1 text-left text-base text-red-500 transition-colors hover:bg-red-50"
                            onClick={handleLogoutButton}
                        >
                            <span className="text-sm pl-0.5"><i className="fa-solid fa-right-from-bracket"></i></span>
                            <span>Log out</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default AdminNavbar;