"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {useSession} from "next-auth/react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import getYearSuffix from "@/utils/getYearSuffix";

export default function PartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialFetchComplete, setInitialFetchComplete] = useState(false);
    const {data: session} = useSession();

    useEffect(() => {
        // Fetch potential matches from the API
        const fetchPartners = async () => {
            try {
                setLoading(true);
                setError(null); // Reset error on new fetch
                const response = await fetch('/api/matches');

                if (!response.ok) {
                    // Try to get error message from response body
                    let errorMsg = `Error: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (e) {
                        // Ignore if response body is not JSON or empty
                    }
                    throw new Error(errorMsg);
                }

                const data = await response.json();

                // --- Data Transformation (Example) ---
                const formattedPartners = data.map(p => ({
                    id: p.id || p._id, // Use id or _id if returned
                    name: p.name || "Unnamed Partner",
                    major: p.major || "N/A",
                    yearOfStudy: p.yearOfStudy || "N/A",
                    matchPercentage: p.matchPercentage || p.compatibility || 0,
                    // Ensure sharedCourses is an array, even if empty
                    sharedCourses: Array.isArray(p.sharedCourses) ? p.sharedCourses.map(course => ({
                        id: course.id || course._id || course.code, // Use a unique identifier
                        code: course.code || "N/A",
                        name: course.name || course.title || "Unknown Course"
                    })) : [],
                }));

                setPartners(formattedPartners);
                setInitialFetchComplete(true);

            } catch (err) {
                console.error("Failed to fetch partners:", err);
                setError(err.message || "Failed to load study partners. Please try again later.");
                setInitialFetchComplete(true);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchPartners();
        } else {
            setLoading(false);
            setInitialFetchComplete(true);
        }
    }, [session]);

    // --- Rendering Logic ---
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <Header/>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar activePage={"/partners"} />

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-white">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Find Study Partners</h2>

                    {/* Container for the partners list, matching the card style in the image */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Find Study Partners</h3>
                        <span className="block border-t border-gray-300 w-full mb-4"></span>

                        {/* Loading state */}
                        {loading && (
                            <div className="flex justify-center items-center py-10">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading potential study partners...</p>
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {!loading && error && (
                            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
                                <p><strong>Error:</strong> {error}</p>
                            </div>
                        )}

                        {/* No partners found state - only show when loading is complete and there are no partners */}
                        {!loading && initialFetchComplete && !error && partners.length === 0 && (
                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                                <h3 className="text-lg font-medium text-yellow-800 mb-2">No Study Partners Found</h3>
                                <p className="text-yellow-700 mb-4">
                                    Consider adding more courses to your profile or adjusting your preferences to find
                                    matches.
                                </p>
                                <Link
                                    href="/profile#courses"
                                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out"
                                >
                                    Manage Courses
                                </Link>
                            </div>
                        )}

                        {/* Partners list - Render only if not loading, no error, and partners exist */}
                        {!loading && !error && partners.length > 0 && (
                            <div className="space-y-3">
                                <ul className="list-none space-y-2 text-gray-600">
                                    {partners.map((partner, index) => (
                                        <li key={partner.id || index} className="w-full">
                                            <div className={`py-4 ${index < partners.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                <div className="grid grid-cols-6 w-[1250px] gap-4 items-center">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 text-xl mr-3 inline">•</span>
                                                        <p className="font-medium text-gray-800 truncate">{partner.name}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {partner.details || partner.major}, {partner.yearOfStudy + getYearSuffix(partner.yearOfStudy)} year
                                                    </p>
                                                    <span className="text-sm text-gray-600">
                                                        Compatibility: {partner.compatibility || partner.matchPercentage}%
                                                    </span>
                                                    <div className="flex items-center">
                                                        <Link href={`/messages/${partner.id}`}
                                                              className="text-sm text-blue-600 hover:underline">
                                                            Message
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Link
                                                            href={`/partners/${partner.id}`}
                                                            className="bg-blue-500 text-white px-4 py-1 rounded text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out">
                                                            Profile
                                                        </Link>
                                                    </div>
                                                </div>
                                                {partner.sharedCourses && partner.sharedCourses.length > 0 && (
                                                    <div className="px-4 mt-2">
                                                        <p className="text-sm font-medium text-gray-600">Shared
                                                            Courses:</p>
                                                        <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 mt-1 ml-4">
                                                            {partner.sharedCourses.map((course) => (
                                                                <li key={course.id || course.code}>
                                                                    {course.code && course.code !== 'N/A' ? `${course.code}: ` : ''}
                                                                    {course.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}