import React from "react";

export default function Header({...props}) {

    return (
        <div className="w-full bg-blue-500 text-white flex items-center p-3">
            <div
                className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center text-xs font-bold mr-2">
                SB
            </div>
            <div className="font-bold">Study Buddy</div>
            <div className="ml-auto">
                <button className="bg-white text-blue-500 px-3 py-1 rounded-md text-sm">User</button>
            </div>
        </div>
    );
}