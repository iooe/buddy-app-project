'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useSession, signOut} from "next-auth/react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import getYearSuffix from "@/utils/getYearSuffix";

export default function Dashboard() {
    const {data: session} = useSession();
    const [courses, setCourses] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    /*const courses = [
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
    ];*/

    /*const partners = [
        { name: "John Doe", details: "Computer Science, 2nd year", compatibility: 100 },
        { name: "vlad2", details: "Computing, 2nd year", compatibility: 100 }, // Assuming 'vlad2' is a username/name
        { name: "Alice Smith", details: "Physics, 3rd year", compatibility: 85 },
        { name: "Emma Wilson", details: "Economics, 4th year", compatibility: 85 },
    ];*/

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

                console.log('Fetched courses:', coursesData);
                console.log('Fetched matches:', matchesData);

                setCourses(coursesData);
                setPartners(matchesData);
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
            <Header/>

            <div className="flex flex-1 overflow-hidden"> {/* Ensure main content area grows and handles overflow */}
                {/* Sidebar */}
                <Sidebar activePage={"/dashboard"}/>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-white"> {/* Allow scrolling within main content */}
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h2>

                    {/* Your Courses Section */}
                    <section className="mb-10 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-700">Your Courses</h3>
                            {/* Container for the links */}
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/profile" className="text-md text-blue-600 hover:underline py-4">
                                Course managing
                            </Link>
                        </div>
                        {/* List of courses - the Course Details link should NOT be inside the <ul> */}
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            {loading ? (
                                <li className="text-gray-500">Loading courses...</li>
                            ) : courses.length > 0 ? (
                                courses.map((course) => (
                                    <div key={course.code || course.id}>
                                        <span className="text-gray-500 mt-1 text-xl mr-3 inline">•</span>
                                        <span
                                            className="font-medium text-gray-700">{course.code}:</span> {course.name || course.title} {/* Display name or title */}
                                    </div>
                                ))
                            ) : (
                                <li className="text-gray-500">No courses enrolled yet.</li>
                            )}
                        </ul>
                    </section>

                    {/* Recommended Partners Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommended Partners</h3>
                        <span className="block border-t border-gray-300 w-full mb-4"></span>
                        {/* Outer container for list items */}
                        <div className="space-y-3">
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {loading ? (
                                    <li className="text-gray-500">Loading matches...</li>
                                ) : partners.length > 0 ? (
                                    partners.map((partner, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center  py-3 ${index < partners.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        >
                                            <span className="text-gray-500 text-xl flex-shrink-0 mr-2">•</span>
                                            <div className="grid grid-cols-4 w-[1000px] gap-4 items-center">
                                                <p className="font-medium text-gray-800 truncate">{partner.name}</p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {partner.details || partner.major}, {partner.yearOfStudy + getYearSuffix(partner.yearOfStudy)} year
                                                </p>
                                                <span className="text-sm text-gray-600">
                                                        Compatibility: {partner.compatibility || partner.matchPercentage}%
                                                    </span>
                                                <Link
                                                    href={`/messages/${partner.id}`}
                                                    className="text-sm text-blue-600 hover:underline justify-self-end"
                                                >
                                                    Message
                                                </Link>
                                            </div>

                                        </div>

                                    ))
                                ) : (
                                    <li className="text-gray-500"> No partners found.</li>
                                )}
                            </ul>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}