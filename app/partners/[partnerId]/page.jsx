"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar"; // Assuming this component exists
import Header from "@/components/ui/Header"; // Assuming this component exists

export default function PartnerProfilePage() {
    const params = useParams();
    const partnerId = params.partnerId;
    const router = useRouter();
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [partner, setPartner] = useState(null);

    // Fetch partner data on component mount
    useEffect(() => {
        const fetchPartnerData = async () => {
            if (!partnerId) return;

            setLoading(true);
            setError("");

            try {
                // Make API call to fetch partner data
                const response = await fetch(`/api/partners/${partnerId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch partner: ${response.status}`);
                }

                const data = await response.json();
                setPartner(data);
            } catch (err) {
                console.error("Error fetching partner data:", err);
                setError("Failed to load partner data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, [partnerId]);

    // Handle logout
    const handleExit = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login'); // Redirect to login page
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                {/* You can use the Header component here if you have it */}
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center space-x-2">
                        <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                        <h1 className="text-xl font-semibold">Study Buddy</h1>
                    </div>
                </header>
                <div className="flex">
                    {/* You can use the Sidebar component here if you have it */}
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                            <p>Loading partner profile...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center space-x-2">
                        <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                        <h1 className="text-xl font-semibold">Study Buddy</h1>
                    </div>
                </header>
                <div className="flex">
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center">
                            <div className="bg-red-100 p-4 rounded-md mb-4 text-red-700">
                                <p>{error}</p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle case where partner is not found
    if (!partner) {
        return (
            <div className="min-h-screen bg-gray-100">
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center space-x-2">
                        <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                        <h1 className="text-xl font-semibold">Study Buddy</h1>
                    </div>
                </header>
                <div className="flex">
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center">
                            <div className="bg-yellow-100 p-4 rounded-md mb-4 text-yellow-700">
                                <p>Partner not found. This user may no longer exist.</p>
                            </div>
                            <Link href="/partners" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-block">
                                Back to Partners
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main content when everything is loaded
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <Header/>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar activePage={"/partners"}/>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-white">
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Profile: {partner.name}
                        </h2>
                        {/* Send Message Button */}
                        <Link
                            href={`/messages/${partner.id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center space-x-2"
                        >
                            <span>Send Message</span>
                        </Link>
                    </div>

                    {/* Information Section */}
                    <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500">Name</span>
                                <span className="text-gray-800">{partner.name}</span>
                            </div>
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500">Major</span>
                                <span className="text-gray-800">{partner.major}</span>
                            </div>
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500">Year of Study</span>
                                <span className="text-gray-800">{partner.yearOfStudy}</span>
                            </div>
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500 shrink-0">Bio</span>
                                <span className="text-gray-800">{partner.bio}</span>
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Preferences</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500">Group Size</span>
                                <span className="text-gray-800">{partner.preferences?.groupSize || "Not specified"}</span>
                            </div>
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500">Study Style</span>
                                <span className="text-gray-800">{partner.preferences?.studyStyle || "Not specified"}</span>
                            </div>
                        </div>
                    </section>

                    {/* Availability Section (New) */}
                    {partner.availability && partner.availability.length > 0 && (
                        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Availability</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                                {partner.availability.map((slot, index) => (
                                    <li key={index}>
                                        <span className="font-medium text-gray-700">{slot.day}:</span> {slot.startTime} - {slot.endTime}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Courses Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Courses</h3>
                        {partner.courses && partner.courses.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                                {partner.courses.map((course, index) => (
                                    <li key={index}>
                                        <span className="font-medium text-gray-700">{course.code}:</span> {course.title}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No courses added</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}