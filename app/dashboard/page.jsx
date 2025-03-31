'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();
    //const [courses, setCourses] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const courses = [
        { code: "BIO101", title: "Introduction to Biology" },
        { code: "CHEM101", title: "General Chemistry" },
        { code: "CS101", title: "Introduction to Programming" },
        { code: "CS201", title: "Data Structures" },
        { code: "ECON101", title: "Principles of Economics" },
        { code: "ENG101", title: "English Composition" },
        { code: "HIST101", title: "World History" },
        { code: "MATH121", title: "Calculus I" },
        { code: "PHYS101", title: "Introduction to Physics" },
        { code: "PSY101", title: "Introduction to Psychology" },
    ];

    const partners = [
        { name: "John Doe", details: "Computer Science, 2nd year", compatibility: 100 },
        { name: "vlad2", details: "Computing, 2nd year", compatibility: 100 }, // Assuming 'vlad2' is a username/name
        { name: "Alice Smith", details: "Physics, 3rd year", compatibility: 85 },
        { name: "Emma Wilson", details: "Economics, 4th year", compatibility: 85 },
    ];

    // const { data: session, status } = useSession(); // Uncomment if using next-auth
    // const router = useRouter(); // Uncomment if using router

    // Example function for handling exit/logout
    const handleExit = async () => {
        // await signOut({ redirect: true, callbackUrl: '/' }); // Example using next-auth signOut
        console.log("Exit clicked - implement logout logic here");
        // router.push('/'); // Redirect to home or login page after logout
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Получение курсов
                const coursesRes = await fetch('/api/courses');
                const coursesData = await coursesRes.json();

                // Получение сопоставлений
                const matchesRes = await fetch('/api/matches');
                const matchesData = await matchesRes.json();

                setCourses(coursesData);
                setMatches(matchesData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-2">
                    <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                    <h1 className="text-xl font-semibold">Study Buddy</h1>
                </div>
                <button className="bg-white text-gray-700 rounded-full h-8 w-16 flex items-center justify-center text-sm hover:bg-gray-200">
                    User {/* Replace with actual user info/icon */}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden"> {/* Ensure main content area grows and handles overflow */}
                {/* Sidebar */}
                <aside className="w-64 bg-gray-50 p-4 flex flex-col justify-between border-r border-gray-200">
                    <nav>
                        <ul>
                            {/* Active state applied to Dashboard */}
                            <li className="mb-2">
                                <Link href="/dashboard" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 font-semibold">
                                    {/* Icon Placeholder */}
                                    <span className="mr-3 h-5 w-5"></span> Dashboard
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/partners" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    {/* Icon Placeholder */}
                                    <span className="mr-3 h-5 w-5"></span> Partners
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/courses" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    {/* Icon Placeholder */}
                                    <span className="mr-3 h-5 w-5"></span> Courses
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/messages" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    {/* Icon Placeholder */}
                                    <span className="mr-3 h-5 w-5"></span> Messages
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/profile" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    {/* Icon Placeholder */}
                                    <span className="mr-3 h-5 w-5"></span> Profile
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/about" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    {/* Icon Placeholder */}
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
                            {/* Icon Placeholder */}
                            <span className="mr-3 h-5 w-5"></span> Exit
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-white"> {/* Allow scrolling within main content */}
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h2>

                    {/* Your Courses Section */}
                    <section className="mb-10 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-700">Your Courses</h3>
                            {/* The image mentions "Course Managing link Redirects to Profile page" - linking to profile */}
                            <Link href="/profile" className="text-sm text-blue-600 hover:underline">
                                Course managing
                            </Link>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            {courses.map((course) => (
                                <li key={course.code}>
                                    <span className="font-medium text-gray-700">{course.code}:</span> {course.title}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Recommended Partners Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommended Partners</h3>
                        <div className="space-y-3">
                            {partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between items-center py-3 ${index < partners.length - 1 ? 'border-b border-gray-200' : ''}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        {/* Optional: Add an avatar placeholder */}
                                        {/* <span className="bg-gray-300 rounded-full h-8 w-8"></span> */}
                                        <div>
                                            <p className="font-medium text-gray-800">{partner.name}</p>
                                            <p className="text-sm text-gray-500">{partner.details}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <span className="text-sm text-gray-600">Compatibility: {partner.compatibility}%</span>
                                        {/* The image mentions "Message link redirects to a chat with selected partner" - linking to messages for now */}
                                        <Link href={`/messages/${partner.name}`} /* Adjust href based on your routing */
                                              className="text-sm text-blue-600 hover:underline">
                                            Message
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}