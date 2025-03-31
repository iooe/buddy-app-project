'use client';

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    // Function to get user initials from name
    const getUserInitials = (name) => {
        if (!name) return "U";

        const nameParts = name.split(" ");
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }

        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <div className="w-full bg-blue-500 text-white flex items-center p-3">
            {session ? (
                <Link href="/dashboard" className="flex items-center">
                    <div
                        className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center text-xs font-bold mr-2">
                        SB
                    </div>
                    <div className="font-bold">Study Buddy</div>
                </Link>
            ) : (
                <div className="flex items-center">
                    <div
                        className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center text-xs font-bold mr-2">
                        SB
                    </div>
                    <div className="font-bold">Study Buddy</div>
                </div>
            )}

            <div className="ml-auto">
                {session && session.user && (
                    <Link href="/profile">
                        <div
                            className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors">
                            {getUserInitials(session.user.name)}
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}