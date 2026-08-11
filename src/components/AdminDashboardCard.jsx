import "@fortawesome/fontawesome-free/css/all.min.css";

export default function AdminDashboardCard({ icon, data, title }) {
    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm cursor-pointer">
            {icon && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black">
                    <i className={`${icon} text-lg text-white`} />
                </div>
            )}

            <h2 className="text-3xl font-bold leading-none text-[#0b1220]">{data}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
        </div>
    );
}