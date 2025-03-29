import React from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

export default function Sidebar({activePage}) {
    const pathname = usePathname();

    // Define navigation items with paths
    const navItems = [
        {name: "Dashboard", path: "/dashboard"},
        {name: "Partners", path: "/partners"},
        {name: "Courses", path: "/courses"},
        {name: "Messages", path: "/messages"},
        {name: "Profile", path: "/profile"},
        {name: "About Project", path: "/about"}
    ];

    // Function to determine if a nav item is active
    const isActive = (path) => {
        // If activePage prop is provided, use it for determining active state
        if (activePage) {
            return activePage === path;
        }
        // Otherwise use the current pathname
        return pathname === path;
    };

    const logout = async () => {
        try {
            // Import signOut dynamically to avoid issues
            const { signOut } = await import("next-auth/react");

            // Use the signOut function from next-auth/react
            await signOut({
                redirect: false,
                callbackUrl: "/"
            });

            // Force reload the page to ensure all state is cleared
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="w-48 bg-white min-h-screen">
            <nav className="py-4 flex flex-col h-full">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={`px-6 text-center py-3 cursor-pointer transition-colors duration-200 ${
                            isActive(item.path)
                                ? "bg-blue-100 text-blue-500 font-medium"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}

                <div className="mt-auto p-4">
                    <button
                        onClick={logout}
                        className="w-full bg-red-100 text-red-500 py-2 rounded hover:bg-red-200 transition-colors duration-200">
                        Exit
                    </button>

                </div>
            </nav>
        </div>
    );
}