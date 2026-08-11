import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLabels, setShowLabels] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let timer;

        if (sidebarOpen) {
            timer = setTimeout(() => {
                setShowLabels(true);
            }, 150);
        } else {
            setShowLabels(false);
        }

        return () => clearTimeout(timer);
    }, [sidebarOpen]);

    // Navigaion menu items for the sidebar
    const menuItems = [
        {
            label: "Dashboard",
            icon: "fa-solid fa-table-cells-large",
            path: "/admin/dashboard"
        },
        {
            label: "User Management",
            icon: "fa-solid fa-users",
            path: "/admin/users"
        },
        {
            label: "Quizzes",
            icon: "fa-regular fa-file-lines",
            path: "/admin/quizzes"
        },
        {
            label: "Questions",
            icon: "fa-regular fa-circle-question",
            path: "/admin/questions"
        },
        {
            label: "Attempts",
            icon: "fa-regular fa-circle-check",
            path: "/admin/attempts"
        },
        {
            label: "Categories",
            icon: "fa-regular fa-window-maximize",
            path: "/admin/categories"
        }
    ];

    return (
        <div className="relative h-full w-12 shrink-0">
            <aside
                className={`absolute left-0 top-0 z-40 h-full overflow-hidden bg-black text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-12"
                    }`}
            >
                <div className="flex items-center justify-between px-3 py-4">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="cursor-pointer text-white"
                        aria-label="Toggle sidebar"
                    >
                        <i className="fa-solid fa-sliders text-xl text-white" />
                    </button>
                </div>

                <nav className="px-2 pb-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => navigate(item.path)}
                            className={`mb-2 flex w-full cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors 
                                ${location.pathname === item.path
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-200 hover:bg-zinc-900"
                                } 
                                
                                ${sidebarOpen ? "justify-start" : "justify-center"}`}
                        >
                            <i className={`${item.icon} text-lg`} />

                            <span className={showLabels ? "block" : "hidden"}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </aside>
        </div>
    );
}

export default Sidebar;