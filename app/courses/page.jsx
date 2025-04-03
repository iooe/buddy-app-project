// app/courses/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';


// Sample Data (Replace with actual data fetching/management)
const allAvailableCourses = [
    { code: "BIO101", title: "Introduction to Biology" },
    { code: "CHEM101", title: "General Chemistry" },
    { code: "CS101", title: "Introduction to Programming" },
    { code: "CS201", title: "Data Structures" },
    { code: "ECON101", title: "Principles of Economics" },
    { code: "ENG101", title: "English Composition" },
    { code: "HIST101", title: "World History" },
    { code: "MATH121", title: "Calculus I" },
    { code: "PHYS101", title: "Introduction to Physics" },
    { code: "PSY101", title: "Introduction to Psychology" },
];

// Initial courses the user already has (example)
const initialUserCourses = [
    { code: "MATH121", title: "Calculus I" },
    { code: "CS101", title: "Intro to Programming" }, // Corrected title slightly to match image more closely
];


export default function CoursesPage() {
/*    const { data: session } = useSession();
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Load data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Get all available courses
                const allCoursesRes = await fetch('/api/courses');
                if (!allCoursesRes.ok) {
                    throw new Error(`Error fetching courses: ${allCoursesRes.status}`);
                }
                const allCoursesData = await allCoursesRes.json();
                setCourses(allCoursesData);

                // Get user's courses
                const userCoursesRes = await fetch('/api/users/courses');
                if (!userCoursesRes.ok) {
                    throw new Error(`Error fetching user courses: ${userCoursesRes.status}`);
                }
                const userCoursesData = await userCoursesRes.json();
                setUserCourses(userCoursesData);

            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Failed to load courses data');
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    const handleAddCourse = async () => {
        if (!selectedCourse) return;

        try {
            setMessage('');
            setError('');

            const response = await fetch('/api/users/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseId: selectedCourse }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error adding course');
            }

            // Refresh user courses
            const updatedCoursesRes = await fetch('/api/users/courses');
            const updatedCoursesData = await updatedCoursesRes.json();
            setUserCourses(updatedCoursesData);

            setSelectedCourse('');
            setMessage('Course added successfully');
        } catch (err) {
            console.error('Error adding course:', err);
            setError(err.message);
        }
    };

    const handleRemoveCourse = async (courseId) => {
        try {
            setMessage('');
            setError('');

            const response = await fetch(`/api/users/courses/${courseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error removing course');
            }

            // Update user courses list
            setUserCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
            setMessage('Course removed successfully');
        } catch (err) {
            console.error('Error removing course:', err);
            setError(err.message);
        }
    };*/

/*    if (!session) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="flex">
                    <Sidebar activePage="/courses" />
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 shadow-md text-center">
                            <p className="text-lg">Please sign in to view and manage your courses</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }*/

    // State for the user's current courses
    const [userCourses, setUserCourses] = useState(initialUserCourses);
    // State for the course selected in the dropdown
    const [selectedCourseCode, setSelectedCourseCode] = useState("");

    // Calculate courses available to add (those not already in userCourses)
    const coursesToAdd = useMemo(() => {
        const userCourseCodes = new Set(userCourses.map(course => course.code));
        return allAvailableCourses.filter(course => !userCourseCodes.has(course.code));
    }, [userCourses]); // Recalculate when userCourses changes

    // Function to handle removing a course
    const handleRemoveCourse = (courseCodeToRemove) => {
        setUserCourses(currentCourses =>
            currentCourses.filter(course => course.code !== courseCodeToRemove)
        );
        // Optionally, if you want the removed course to immediately reappear in dropdown:
        // No extra action needed here because `coursesToAdd` recalculates automatically.
    };

    // Function to handle adding the selected course
    const handleAddCourse = () => {
        if (!selectedCourseCode) return; // Do nothing if no course is selected

        const courseToAdd = allAvailableCourses.find(course => course.code === selectedCourseCode);

        if (courseToAdd && !userCourses.some(c => c.code === courseToAdd.code)) {
            setUserCourses(currentCourses => [...currentCourses, courseToAdd]);
            setSelectedCourseCode(""); // Reset dropdown after adding
        }
    };

    // Function to handle dropdown selection change
    const handleSelectChange = (event) => {
        setSelectedCourseCode(event.target.value);
    };


    // Example function for handling exit/logout (reuse or move to a layout component)
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
                            {/* Active state applied to Courses */}
                            <li className="mb-2">
                                <Link href="/courses" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 font-semibold">
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
                <main className="flex-1 p-8 overflow-y-auto bg-white">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Courses Management</h2>

                    {/* Your Courses Section */}
                    <section className="mb-10 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Courses</h3>
                        {userCourses.length > 0 ? (
                            <div className="space-y-3">
                                {userCourses.map((course) => (
                                    <div key={course.code} className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                                        <span className="text-gray-800 font-medium">
                                            {course.code} - {course.title}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveCourse(course.code)}
                                            className="text-red-600 bg-white border border-red-300 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">You haven't added any courses yet.</p>
                        )}
                    </section>

                    {/* Add a New Course Section */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add a New Course</h3>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedCourseCode}
                                onChange={handleSelectChange}
                                className="block w-full md:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                            >
                                <option value="">Select a course...</option>
                                {coursesToAdd.map((course) => (
                                    <option key={course.code} value={course.code}>
                                        {course.code} - {course.title}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddCourse}
                                disabled={!selectedCourseCode} // Disable button if no course is selected
                                className={`px-4 py-2 rounded-md text-sm font-medium text-white 
                                            ${!selectedCourseCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                Add Course
                            </button>
                        </div>
                        {coursesToAdd.length === 0 && userCourses.length > 0 && (
                            <p className="text-sm text-gray-500 mt-4">You have added all available courses.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}