'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const messageSummaries = [
    {
        id: "vlad2", // Use the partner's ID or a conversation ID
        partnerName: "Vlad",
        lastMessage: "Hello Roman",
        date: "10.03.2025",
    },
    {
        id: "john_doe",
        partnerName: "John Doe",
        lastMessage: "Can we meet today?",
        date: "10.03.2025",
    },
    {
        id: "emma_wilson",
        partnerName: "Emma",
        lastMessage: "Shared notes for Calculus",
        date: "09.03.2025",
    },
    // Add more message summaries as needed
];


export default function Messages() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                if (!session) return;

                const response = await fetch('/api/messages/conversations');
                const data = await response.json();

                setConversations(data);
            } catch (error) {
                console.error('Ошибка загрузки бесед:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [session]);

/*    if (loading) {
        return <div>Загрузка...</div>;
    }*/

    const handleExit = async () => {
        console.log("Exit clicked - implement logout logic here");
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
                            {/* Active state applied to Messages */}
                            <li className="mb-2">
                                <Link href="/messages" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 font-semibold">
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
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Messages</h2>

                    {/* Your Messages Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Messages</h3>
                        {messageSummaries.length > 0 ? (
                            <div className="space-y-3">
                                {messageSummaries.map((msg) => (
                                    <Link
                                        key={msg.id}
                                        href={`/messages/${msg.id}`} // Link to the specific chat page
                                        className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-100 transition duration-150 ease-in-out cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">{msg.partnerName}</p>
                                                <p className="text-sm text-gray-600 truncate">{msg.lastMessage}</p> {/* truncate ensures long messages don't break layout */}
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{msg.date}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">You have no messages yet.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}