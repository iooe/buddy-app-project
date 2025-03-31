// app/about/page.tsx
"use client";

import Link from "next/link";

export default function AboutPage() {

    // Example function for handling exit/logout
    const handleExit = async () => {
        console.log("Exit clicked - implement logout logic here");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                    <h1 className="text-xl font-semibold">Study Buddy</h1>
                </div>
                <button className="bg-white text-gray-700 rounded-full h-8 w-16 flex items-center justify-center text-sm hover:bg-gray-200">
                    User {/* Replace */}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-50 p-4 flex flex-col justify-between border-r border-gray-200 flex-shrink-0">
                    <nav>
                        <ul>
                            <li className="mb-2">
                                <Link href="/dashboard" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Dashboard
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/partners" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Partners
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/courses" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Courses
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/messages" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Messages
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/profile" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Profile
                                </Link>
                            </li>
                            {/* Active state applied to About Project */}
                            <li className="mb-2">
                                <Link href="/about" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 font-semibold">
                                    <span className="mr-3 h-5 w-5"></span> About Project
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {/* Exit Button */}
                    <div>
                        <button
                            onClick={handleExit}
                            className="w-full flex items-center justify-center p-2 rounded-md text-red-700 bg-red-100 hover:bg-red-200 font-medium"
                        >
                            <span className="mr-3 h-5 w-5"></span> Exit
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden bg-white">
                    {/* Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <h2 className="text-3xl font-bold mb-8 text-gray-800">About Study Buddy</h2>

                        {/* About Section */}
                        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">About</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Study Buddy is a platform designed to help students find the perfect study partners for effective and enjoyable learning. We understand that studying can be more
                                effective and enjoyable when you work with peers, and our goal is to connect you with study partners who share your learning style and preferences.
                            </p>
                        </section>

                        {/* Our Mission Section */}
                        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Our Mission</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Create a community where students can start their journey of self-improvement, achieve knowledge, and enhance their academic results through collaborative
                                learning.
                            </p>
                        </section>

                        {/* How It Works Section */}
                        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">How It Works</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 leading-relaxed">
                                <li>
                                    <span className="font-medium text-gray-700">Create a profile</span> — Register and add information about yourself, the courses you're studying, and your study preferences.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Find a partner</span> — Our algorithm matches you with students who share your courses, learning style, and preferences.
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Start learning</span> — Connect with potential study partners through our messaging system and plan your study sessions, times, and locations.
                                </li>
                            </ol>
                        </section>

                        {/* Benefits Section */}
                        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Benefits of Collaborative Learning</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 leading-relaxed">
                                <li>Increased motivation and accountability</li>
                                <li>Diverse perspectives on vision and problem-solving methods</li>
                                <li>Development of communication skills and teamwork abilities</li>
                                <li>Deeper understanding of material thanks to explanations from others</li>
                                <li>Reduced stress and preference procrastination</li> {/* Note: "preference procrastination" seems like a typo in the image, copied as is */}
                            </ul>
                        </section>

                        {/* Get Started Section */}
                        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Get Started</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Join Study Buddy today to connect with study partners who will help you achieve academic success. Register now—it only takes a few minutes, and you can start
                                finding the perfect study companion!
                            </p>
                            {/* Optional: Add a Register/Login button here if appropriate */}
                            {/* <div className="mt-4">
                                <Link href="/register" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium">
                                    Register Now
                                </Link>
                            </div> */}
                        </section>

                    </div>
                    {/* Footer */}
                    <footer className="p-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        © 2025 Study Buddy. All rights reserved.
                    </footer>
                </main>
            </div>
        </div>
    );
}