import{ memo } from "react";
import { useState } from "react";
import UsersPage from "../UsersPage";
import CompaniesPage from "../CompaniesPage";
import JobsPage from "../JobsPage";
const AdminHomePage = () =>{
    const [tab, setTab] = useState("users");
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
                <h1 className="text-2xl font-bold text-teal-400">Admin Panel</h1>
                <nav className="space-y-2">
                <button
                    onClick={() => setTab("users")}
                    className={`block w-full text-left px-4 py-2 rounded ${
                    tab === "users" ? "bg-teal-600" : "hover:bg-gray-700"
                    }`}
                >
                    Quản lý Người dùng
                </button>
                <button
                    onClick={() => setTab("companies")}
                    className={`block w-full text-left px-4 py-2 rounded ${
                    tab === "companies" ? "bg-teal-600" : "hover:bg-gray-700"
                    }`}
                >
                    Quản lý Công ty
                </button>
                <button
                    onClick={() => setTab("jobs")}
                    className={`block w-full text-left px-4 py-2 rounded ${
                    tab === "jobs" ? "bg-teal-600" : "hover:bg-gray-700"
                    }`}
                >
                    Quản lý Tin tuyển dụng
                </button>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                {tab === "users" && <UsersPage />}
                {tab === "companies" && <CompaniesPage />}
                {tab === "jobs" && <JobsPage />}
            </main>
        </div>
    );
}

export default memo(AdminHomePage);