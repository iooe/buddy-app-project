import React from 'react';
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header/>

            <div className="flex">
                {/* Sidebar */}
                <Sidebar/>

                {/* Main Content */}
                <div className="flex-1 w-max max-w-5xl p-6 bg-gray-100">
                    <h1 className="text-xl font-semibold mb-6">About Study Buddy</h1>

                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">About</h2>
                        <p className="text-gray-700">
                            Study Buddy is a platform designed to help students find the perfect study partners for
                            effective and enjoyable learning. We understand that studying can be more effective and
                            enjoyable when you work with peers, and our goal is to connect you with study partners who
                            share your learning style and preferences.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Our Mission</h2>
                        <p className="text-gray-700">
                            Create a community where students can start their journey of self-improvement, achieve
                            knowledge, and enhance their academic results through collaborative learning.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">How It Works</h2>
                        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                            <li>Create a profile — Register and add information about yourself, the courses you're
                                studying, and your study preferences.
                            </li>
                            <li>Find a partner — Our algorithm matches you with students who share your courses,
                                learning style, and preferences.
                            </li>
                            <li>Start learning — Connect with potential study partners through our messaging system and
                                plan your study sessions, times, and locations.
                            </li>
                        </ol>
                    </div>

                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Benefits of Collaborative Learning</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                <span>Increased motivation and accountability</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                <span>Diverse perspectives on vision and problem-solving methods</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                <span>Development of communication skills and teamwork abilities</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                <span>Deeper understanding of material thanks to explanations from others</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                <span>Reduced stress and preference procrastination</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Get Started</h2>
                        <p className="text-gray-700">
                            Join Study Buddy today to connect with study partners who will help you achieve academic
                            success. Register now—it only takes a few minutes, and you can start finding the perfect
                            study companion!
                        </p>
                    </div>

                    <div className="text-center text-gray-500 text-sm">
                        © 2023 Study Buddy. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}