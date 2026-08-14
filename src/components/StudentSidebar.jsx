import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function StudentSidebar({sidebarOpen,setSidebarOpen}) {
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
            path: "/student/dashboard"
        },
        {
            label: "Quizzes",
            icon: "fa-regular fa-file-lines",
            path: "/student/quizzes"
        },
        {
            label: "History",
            icon: "fa-solid fa-clock-rotate-left",
            path: "/student/history"
        },
        {
            label: "Leaderboard",
            icon: "fa-regular fa-chart-bar",
            path: "/student/leaderboard"
        }
    ];

    const handleNavigation = (path) => {
    // Only navigate if the user is clicking a link to a different path
    if (location.pathname !== path) {
        navigate(path);
    }
};

    return (
        <div className="relative h-full w-0 shrink-0">
            <aside
                className={`absolute left-0 top-0 z-40 h-full overflow-hidden bg-black text-white transition-all duration-300 
                    ${sidebarOpen ? "w-64" : "w-0"
                    }`}
            >
                <nav className="px-2 pb-4 pt-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() =>{ handleNavigation(item.path), setSidebarOpen(false)}}
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

export default StudentSidebar;