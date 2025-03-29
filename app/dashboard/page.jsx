'use client';

import React from 'react';
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header/>

            <div className="flex">
                {/* Sidebar */}
                <Sidebar activePage="/about"/>

                {/* Main Content */}
                <div className="flex-1 w-max max-w-5xl p-6 bg-gray-100">
                    <h1 className="text-xl font-semibold mb-6">Dashboard</h1>


                    <div className="text-center text-gray-500 text-sm">
                        © 2023 Study Buddy. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}