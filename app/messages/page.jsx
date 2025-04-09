'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import parseDate from "@/utils/parseDate";

/*const messageSummaries = [
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
*/


export default function Messages() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("Session data:", session);
    console.log("Conversations data:", conversations);
    console.log("Loading state:", loading);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                if (!session) return;

                const response = await fetch('/api/messages/conversations');
                const data = await response.json();

                setConversations(data);
            } catch (error) {
                console.error('Error loading conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [session]);

    /*    if (loading) {
            return <div>Loading...</div>;
        }*/

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <Header/>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar activePage={"/messages"}/>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-white">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Messages</h2>

                    {/* Your Messages Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Messages</h3>
                        {conversations.length > 0 ? (
                            <div className="space-y-3">
                                {conversations.map((msg) => (
                                    <Link
                                        key={msg.userId}
                                        href={`/messages/${msg.userId}`} // Link to the specific chat page
                                        className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-100 transition duration-150 ease-in-out cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">{msg.userName}</p>
                                                <p className="text-sm text-gray-600 truncate">{msg.lastMessage}</p> {/* truncate ensures long messages don't break layout */}
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{parseDate(msg.lastMessageDate)}</span>
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