import React from "react";

export default function Sidebar({...props}) {

    return (
        <div className="w-48 bg-white min-h-screen">
            <nav className="py-4">
                <div className="px-6 text-center py-3 hover:bg-gray-100 cursor-pointer">Dashboard</div>
                <div className="px-6 text-center py-3 hover:bg-gray-100 cursor-pointer">Partners</div>
                <div className="px-6 text-center py-3 hover:bg-gray-100 cursor-pointer">Courses</div>
                <div className="px-6 text-center py-3 hover:bg-gray-100 cursor-pointer">Messages</div>
                <div className="px-6 text-center py-3 hover:bg-gray-100 cursor-pointer">Profile</div>
                <div className="px-6 text-center py-3 bg-blue-100 text-blue-500 cursor-pointer font-medium">About
                    Project
                </div>

                <div className="mt-auto p-4">
                    <button className="w-full bg-red-100 text-red-500 py-2 rounded mt-64">Exit</button>
                </div>
            </nav>
        </div>
    );
}