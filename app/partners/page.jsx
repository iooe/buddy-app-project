// app/partners/page.tsx
"use client";

import Link from "next/link";
// import { useSession, signOut } from "next-auth/react"; // Import if using next-auth
// import { useRouter } from "next/navigation"; // Import if navigation logic is needed

export default function PartnersPage() {
    // Example partners data - replace with actual data fetching later
    const partners = [
        {
            id: "john_doe",
            name: "John Doe",
            details: "Computer Science, 2nd year",
            compatibility: 100,
            sharedCourses: ["MATH101: Calculus I"],
        },
        {
            id: "vlad2",
            name: "vlad2", // Assuming 'vlad2' is a username/name
            details: "Computing, 2nd year",
            compatibility: 100,
            sharedCourses: ["MATH101: Calculus I"],
        },
        {
            id: "alice_smith",
            name: "Alice Smith",
            details: "Physics, 3rd year",
            compatibility: 85,
            sharedCourses: ["MATH101: Calculus I"],
        },
        { // Added another partner for list demonstration
            id: "emma_wilson",
            name: "Emma Wilson",
            details: "Economics, 4th year",
            compatibility: 85,
            sharedCourses: ["ECON101: Principles of Economics", "MATH101: Calculus I"],
        },
    ];

    // const { data: session, status } = useSession(); // Uncomment if using next-auth
    // const router = useRouter(); // Uncomment if using router

    // Example function for handling exit/logout (reuse or move to a layout component)
    const handleExit = async () => {
        // await signOut({ redirect: true, callbackUrl: '/' }); // Example using next-auth signOut
        console.log("Exit clicked - implement logout logic here");
        // router.push('/'); // Redirect to home or login page after logout
    };

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
                <main className="flex-1 p-8 overflow-y-auto bg-white"> {/* Allow scrolling within main content */}
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Find Study Partners</h2>

                    {/* Find Study Partners Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Find Study Partners</h3>
                        <div className="space-y-4"> {/* Added space-y for vertical spacing between entries */}
                            {partners.map((partner, index) => (
                                <div
                                    key={partner.id}
                                    className={`flex flex-col md:flex-row justify-between md:items-start py-4 ${index < partners.length - 1 ? 'border-b border-gray-200' : ''}`}
                                >
                                    {/* Partner Info */}
                                    <div className="mb-4 md:mb-0">
                                        <p className="font-semibold text-lg text-gray-800">{partner.name}</p>
                                        <p className="text-sm text-gray-500 mb-2">{partner.details}</p>
                                        <p className="text-sm font-medium text-gray-600">Shared Courses:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 mt-1 ml-4">
                                            {partner.sharedCourses.map((course, courseIndex) => (
                                                <li key={courseIndex}>{course}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Compatibility & Actions */}
                                    {/* Adjusted alignment for medium screens and up */}
                                    <div className="flex flex-col items-start md:items-end space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-6 mt-2 md:mt-0">
                                        <span className="text-sm text-gray-600 whitespace-nowrap">Compatibility: {partner.compatibility}%</span>
                                        <div className="flex items-center space-x-4">
                                            {/* Message Link */}
                                            <Link href={`/messages/${partner.id}`} // Use partner ID for unique routing
                                                  className="text-sm text-blue-600 hover:underline">
                                                Message
                                            </Link>
                                            {/* Profile Button */}
                                            <Link href={`/partners/${partner.id}`} // Use partner ID for unique routing
                                                  className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-600">
                                                Profile
                                            </Link>
                                        </div>
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