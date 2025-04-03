// app/profile/[partnerId]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from 'next/navigation'; // Hook to get route parameters
// import { useSession, signOut } from "next-auth/react"; // Import if using next-auth
// import { useRouter } from "next/navigation"; // Import if navigation logic is needed (e.g., partner not found)

// Sample Data (In a real app, you'd fetch this based on partnerId)
const allPartnersData = [
    {
        id: "john_doe",
        name: "John Doe",
        major: "Computer Science",
        year: 2,
        bio: "I love coding and math!",
        preferences: {
            groupSize: "Small group",
            studyStyle: "Visual",
        },
        courses: [
            // Example: { code: "CS101", title: "Introduction to Programming" }
            // Currently empty as per the image for John Doe
        ],
    },
    {
        id: "vlad2",
        name: "vlad2",
        major: "Computing",
        year: 2,
        bio: "Interested in algorithms and data structures.",
        preferences: {
            groupSize: "Pairs",
            studyStyle: "Hands-on",
        },
        courses: [
            { code: "CS201", title: "Data Structures" },
            { code: "MATH101", title: "Calculus I" },
        ],
    },
    {
        id: "alice_smith",
        name: "Alice Smith",
        major: "Physics",
        year: 3,
        bio: "Fascinated by the universe. Looking for quantum mechanics study partners.",
        preferences: {
            groupSize: "Small group",
            studyStyle: "Quiet",
        },
        courses: [
            { code: "PHYS101", title: "Introduction to Physics" },
            { code: "MATH121", title: "Calculus I" },
        ],
    },
    {
        id: "emma_wilson",
        name: "Emma Wilson",
        major: "Economics",
        year: 4,
        bio: "Focusing on macroeconomics and econometrics.",
        preferences: {
            groupSize: "Any",
            studyStyle: "Discussion",
        },
        courses: [
            { code: "ECON101", title: "Principles of Economics" },
        ],
    },
];


export default function PartnerProfilePage() {
    const params = useParams(); // Get route parameters { partnerId: '...' }
    const partnerId = params.partnerId; // Extract partnerId
    // const router = useRouter(); // Uncomment if needed for redirects

    // Find the partner data based on the ID from the URL
    const partner = allPartnersData.find(p => p.id === partnerId);

    // Example function for handling exit/logout (reuse or move to a layout component)
    const handleExit = async () => {
        // await signOut({ redirect: true, callbackUrl: '/' }); // Example using next-auth signOut
        console.log("Exit clicked - implement logout logic here");
        // router.push('/'); // Redirect to home or login page after logout
    };

    // Handle case where partner is not found
    if (!partner) {
        // You might want a more user-friendly "Not Found" page or redirect
        return (
            <div className="flex justify-center items-center h-screen">
                Partner not found.
            </div>
        );
    }

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
                        {/* Note: Image shows "Partners" still selected, adjust if needed */}
                        <ul>
                            <li className="mb-2">
                                <Link href="/dashboard" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Dashboard
                                </Link>
                            </li>
                            {/* Active state applied to Partners as per image */}
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
                            {/* Own Profile link */}
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
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Profile: {partner.name}
                        </h2>
                        {/* Send Message Button */}
                        <Link
                            href={`/messages/${partner.id}`} // Link to chat page for this partner
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center space-x-2"
                        >
                            {/* Optional: Add message icon here */}
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
                                <span className="text-gray-800">{partner.year}</span>
                            </div>
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500 shrink-0">Bio</span> {/* shrink-0 prevents label from shrinking */}
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
                                <span className="text-gray-800">{partner.preferences.groupSize}</span>
                            </div>
                            <div className="flex">
                                <span className="w-28 font-medium text-gray-500">Study Style</span>
                                <span className="text-gray-800">{partner.preferences.studyStyle}</span>
                            </div>
                        </div>
                    </section>

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