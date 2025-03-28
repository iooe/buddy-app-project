'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

export default function CoursesPage() {
    const { data: session } = useSession();
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
    };

    if (!session) {
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
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header />

            <div className="flex">
                {/* Sidebar */}
                <Sidebar activePage="/courses" />

                {/* Main Content */}
                <div className="flex-1 w-max max-w-5xl p-6 bg-gray-100">
                    <h1 className="text-xl font-semibold mb-6">Courses Management</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* Success message */}
                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                            {message}
                        </div>
                    )}

                    {/* Loading indicator */}
                    {loading ? (
                        <div className="bg-white rounded-lg p-6 mb-6 flex justify-center items-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-3"></div>
                            <p>Loading courses...</p>
                        </div>
                    ) : (
                        <>
                            {/* Your Courses Section */}
                            <div className="bg-white rounded-lg p-6 mb-6">
                                <h2 className="text-lg font-medium mb-4">Your Courses</h2>

                                {userCourses.length === 0 ? (
                                    <p className="text-gray-600">You haven't added any courses yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {userCourses.map(course => (
                                            <div key={course.id} className="flex justify-between items-center bg-blue-50 p-4 rounded">
                                                <div>
                                                    <div className="font-medium">{course.code}</div>
                                                    <div className="text-sm text-gray-600">{course.name}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveCourse(course.id)}
                                                    className="px-3 py-1 border border-red-300 text-red-500 rounded hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add New Course Section */}
                            <div className="bg-white rounded-lg p-6 mb-6">
                                <h2 className="text-lg font-medium mb-4">Add a New Course</h2>

                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <div className="absolute left-3 top-3 flex items-center text-blue-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </div>
                                        <select
                                            value={selectedCourse}
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a course</option>
                                            {courses
                                                .filter(course => !userCourses.some(uc => uc.id === course.id))
                                                .map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.code}: {course.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAddCourse}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={!selectedCourse}
                                    >
                                        Add Course
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="text-center text-gray-500 text-sm">
                        © 2023 Study Buddy. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}