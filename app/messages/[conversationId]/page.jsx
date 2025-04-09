'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import parseDate from "@/utils/parseDate";


export default function Conversation() {
    const params = useParams();
    const userId = params.conversationId;
    const { data: session } = useSession();
    const [recipient, setRecipient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for the input field
    const [inputText, setInputText] = useState("");
    // Ref for the message container to enable auto-scrolling
    const messagesEndRef = useRef(null);

    console.log("User ID from URL:", userId);
    console.log("Session data:", session);
    console.log("Recipient data:", recipient);
    console.log("Messages data:", messages);
    console.log("Loading state:", loading);
    console.log("Input text:", inputText);
    console.log("Messages end ref:", messagesEndRef);

    useEffect(() => {
        let isMounted = true;

        const fetchConversation = async () => {
            try {
                if (!session) return;

                // Get recipient data first
                const userRes = await fetch(`/api/users/${userId}`);

                if (!userRes.ok) {
                    throw new Error('User not found or API error');
                }

                const userData = await userRes.json();

                if (isMounted) {
                    setRecipient(userData);
                }

                // Only proceed to get messages if we found the user
                try {
                    const messagesRes = await fetch(`/api/messages/${userId}`);

                    if (messagesRes.ok) {
                        const messagesData = await messagesRes.json();
                        if (isMounted) {
                            setMessages(messagesData);
                        }
                    }
                } catch (messageError) {
                    console.error('Error loading messages:', messageError);
                    // Don't set error state here, we already have the user
                }

            } catch (error) {
                console.error('Error loading conversation:', error);
                if (isMounted) {
                    setError('User not found');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        setLoading(true);
        setError(null);
        fetchConversation();

        return () => {
            isMounted = false;
        };
    }, [session, userId]);

    // Scroll down when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId: userId,
                    content: inputText,
                }),
            });

            if (!response.ok) throw new Error('Message sending error');

            const data = await response.json();
            setMessages([...messages, data.message]);
            setInputText('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Loading screen
    if (loading || (error || !recipient)) {
        return (
            <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
                <div className="text-center p-8 rounded-lg bg-white shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Loading conversation...</p>
                </div>
            </div>
        );
    }

    // Error screen (when user not found)
    // if (error || !recipient) {
    //     return (
    //         <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
    //             <div className="text-center p-8 rounded-lg bg-white shadow-md">
    //                 <p className="text-lg font-medium text-red-500">User not found</p>
    //                 <Link href="/messages" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    //                     Back to Messages
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

    // Function to handle Enter key press in input
    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            await handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <Header/>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar activePage={"/messages"}/>

                {/* Main Content - Chat Interface */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Chat with {recipient.name}
                        </h2>
                    </div>

                    {/* Message Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => {
                            // Check if the current user is the sender
                            const isCurrentUserSender = session?.user?.id === msg.senderId;

                            return (
                                <div key={msg.id} className={`flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg shadow-sm ${
                                        isCurrentUserSender
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <p className={`text-xs mt-1 ${
                                            isCurrentUserSender ? 'text-blue-200 text-right' : 'text-gray-500 text-right'
                                        }`}>
                                            {parseDate(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Empty div to mark the end of messages for auto-scrolling */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-gray-100 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress} // Send on Enter
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm font-medium disabled:bg-gray-400"
                                disabled={inputText.trim() === ""} // Disable if input is empty
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}