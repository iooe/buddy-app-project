"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Fetch potential matches from the API
        const fetchPartners = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/matches');

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setPartners(data);
            } catch (err) {
                console.error("Failed to fetch partners:", err);
                setError("Failed to load study partners. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchPartners();
        }
    }, [session]);

    // Handle logout function
    const handleExit = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                        <h1 className="text-xl font-semibold">Study Buddy</h1>
                    </Link>
                </div>
                <Link href="/profile" className="bg-white text-gray-700 rounded-full h-8 px-4 flex items-center justify-center text-sm hover:bg-gray-200">
                    {session?.user?.name || "User"}
                </Link>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-50 p-4 flex flex-col justify-between border-r border-gray-200">
                    <nav>
                        <ul>
                            <li className="mb-2">
                                <Link href="/dashboard" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Dashboard
                                </Link>
                            </li>
                            {/* Active state applied to Partners */}
                            <li className="mb-2">
                                <Link href="/partners" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 font-semibold">
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
                            <li className="mb-2">
                                <Link href="/about" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
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
                <main className="flex-1 p-8 overflow-y-auto bg-white">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Find Study Partners</h2>

                    {/* Loading state */}
                    {loading && (
                        <div className="flex justify-center items-center h-60">
                            <p className="text-gray-600">Loading potential study partners...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* No partners found */}
                    {!loading && !error && partners.length === 0 && (
                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                            <h3 className="text-lg font-medium text-yellow-800 mb-2">No study partners found</h3>
                            <p className="text-yellow-700">
                                Add more courses to your profile to find potential study partners with similar interests.
                            </p>
                            <Link
                                href="/profile#courses"
                                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                            >
                                Add Courses
                            </Link>
                        </div>
                    )}

                    {/* Partners list */}
                    {!loading && !error && partners.length > 0 && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommended Study Partners</h3>
                            <div className="space-y-4">
                                {partners.map((partner, index) => (
                                    <div
                                        key={partner.id}
                                        className={`flex flex-col md:flex-row justify-between md:items-start py-4 ${index < partners.length - 1 ? 'border-b border-gray-200' : ''}`}
                                    >
                                        {/* Partner Info */}
                                        <div className="mb-4 md:mb-0">
                                            <p className="font-semibold text-lg text-gray-800">{partner.name}</p>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {partner.major || "Major not specified"}
                                                {partner.yearOfStudy ? `, ${partner.yearOfStudy}${getYearSuffix(partner.yearOfStudy)} year` : ""}
                                            </p>
                                            <p className="text-sm font-medium text-gray-600">Shared Courses:</p>
                                            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 mt-1 ml-4">
                                                {partner.sharedCourses.map((course) => (
                                                    <li key={course.id}>{course.code}: {course.name}</li>
                                                ))}
                                            </ul>

                                            {/* Display study preferences if available */}
                                            {partner.preferences && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-gray-600">Study Preferences:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-500 mt-1 ml-4">
                                                        {partner.preferences.groupSize && (
                                                            <li>Group Size: {partner.preferences.groupSize}</li>
                                                        )}
                                                        {partner.preferences.studyStyle && (
                                                            <li>Study Style: {partner.preferences.studyStyle}</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Compatibility & Actions */}
                                        <div className="flex flex-col items-start md:items-end space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-6 mt-2 md:mt-0">
                                            <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                                <span className="text-sm font-medium text-blue-800">
                                                    {partner.matchPercentage}% Match
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {/* Message Link */}
                                                <Link href={`/messages/${partner.id}`}
                                                      className="text-sm text-blue-600 hover:underline">
                                                    Message
                                                </Link>
                                                {/* Profile Button */}
                                                <Link href={`/partners/${partner.id}`}
                                                      className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-600">
                                                    Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

// Helper function to get the correct suffix for year of study
function getYearSuffix(year) {
    const yearNum = parseInt(year);
    if (yearNum === 1) return "st";
    if (yearNum === 2) return "nd";
    if (yearNum === 3) return "rd";
    return "th";
}