'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Sample Data Store (Replace with actual data fetching/management)
const allConversations= {
    "vlad2": {
        partnerName: "Vlad",
        messages: [
            { id: 1, text: "Hello Vlad", timestamp: "17:55", sender: 'other' },
            { id: 2, text: "Hey, let's study together!", timestamp: "18:00", sender: 'self' },
            { id: 3, text: "Sure, sounds good!", timestamp: "18:05", sender: 'other' },
        ]
    },
    "john_doe": {
        partnerName: "John Doe",
        messages: [
            { id: 4, text: "Can we meet today?", timestamp: "10:15", sender: 'other' },
            { id: 5, text: "Yes, how about 3 PM at the library?", timestamp: "10:18", sender: 'self' },
        ]
    },
    "emma_wilson": {
        partnerName: "Emma",
        messages: [
            { id: 6, text: "Shared notes for Calculus", timestamp: "09:40", sender: 'other' },
        ]
    },
    // Add more conversations as needed
};


export default function Conversation() {
/*    const { userId } = useParams();
    const { data: session } = useSession();
    const [recipient, setRecipient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                if (!session) return;

                // Получение данных о собеседнике
                const userRes = await fetch(`/api/users/${userId}`);
                const userData = await userRes.json();

                // Получение сообщений
                const messagesRes = await fetch(`/api/messages/${userId}`);
                const messagesData = await messagesRes.json();

                setRecipient(userData);
                setMessages(messagesData);
            } catch (error) {
                console.error('Ошибка загрузки переписки:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [session, userId]);

    // Прокрутка вниз при изменении сообщений
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId: userId,
                    content: newMessage,
                }),
            });

            if (!response.ok) throw new Error('Ошибка отправки сообщения');

            const data = await response.json();
            setMessages([...messages, data.message]);
            setNewMessage('');
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!recipient) {
        return <div>Пользователь не найден</div>;
    }*/


    const params = useParams();
    const conversationId = params.conversationId;

    // State for the messages in the current chat
    const [messages, setMessages] = useState([]);
    // State for the partner's name
    const [partnerName, setPartnerName] = useState("");
    // State for the input field
    const [inputText, setInputText] = useState("");

    // Ref for the message container to enable auto-scrolling
    const messagesEndRef = useRef(null);

    // Fetch conversation data based on ID (simulation)
    useEffect(() => {
        if (conversationId && allConversations[conversationId]) {
            setMessages(allConversations[conversationId].messages);
            setPartnerName(allConversations[conversationId].partnerName);
        } else {
            // Handle conversation not found (e.g., redirect or show error)
            setPartnerName("Unknown Chat");
            setMessages([]);
        }
    }, [conversationId]); // Re-run when conversationId changes

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // Function to handle sending a message (simulation)
    const handleSendMessage = () => {
        if (inputText.trim() === "") return; // Don't send empty messages

        const newMessage = {
            id: Date.now(), // Simple unique ID for demo purposes
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Current time
            sender: 'self',
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText(""); // Clear input field
    };

    // Function to handle Enter key press in input
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };


    // Example function for handling exit/logout
    const handleExit = async () => {
        console.log("Exit clicked - implement logout logic here");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <span className="bg-white text-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">SB</span>
                    <h1 className="text-xl font-semibold">Study Buddy</h1>
                </div>
                <button className="bg-white text-gray-700 rounded-full h-8 w-16 flex items-center justify-center text-sm hover:bg-gray-200">
                    User {/* Replace */}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-50 p-4 flex flex-col justify-between border-r border-gray-200 flex-shrink-0">
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

                {/* Main Content - Chat Interface */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Chat with {partnerName}
                        </h2>
                    </div>

                    {/* Message Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg shadow-sm ${
                                    msg.sender === 'self'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        msg.sender === 'self' ? 'text-blue-200 text-right' : 'text-gray-500 text-right'
                                    }`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
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