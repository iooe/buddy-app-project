"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Auth() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If authenticated (session exists), redirect to dashboard
        if (status === "authenticated" && session) {
            router.push("/dashboard");
        } else {
            setLoading(false);
        }
    }, [session, status, router]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
            {/* Header Section */}
            <div className="text-center"
                 style={{ position: 'absolute', top: '34px' }}
            >
                <h1 className="text-3xl font-bold text-black"
                >Study Buddy</h1>
                <p className="text-base font-normal text-gray-600 mt-2">Connect. Study. Succeed.</p>
            </div>

            {/* Button Container */}
            <div className="bg-white shadow-md rounded-lg p-5 w-72 mt-12">
                {/* Register Button */}
                <div className="flex items-center space-x-2 mb-2 p-4">
                    <button className="bg-blue-500 text-white rounded-md flex-1 h-10 font-medium hover:bg-blue-600">
                        <Link href={'/register'}>
                            Register
                        </Link>
                    </button>

                </div>

                {/* Login Button */}
                <div className="flex items-center space-x-2 p-4">
                    <button className="border-2 border-blue-500 text-blue-500 rounded-md flex-1 h-10 font-medium hover:bg-blue-100">
                        <Link href={'/login'}>
                            Login
                        </Link>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 w-full text-center text-xs text-gray-400 py-4">
                © 2025 Study Buddy
            </div>
        </div>
    );
}