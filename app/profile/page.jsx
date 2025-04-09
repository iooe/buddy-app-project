'use client';

import React, {useState, useEffect} from 'react';
import {useSession, signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

export default function Profile() {
    const {data: session} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [message, setMessage] = useState('');

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: '',
        major: '',
        yearOfStudy: '',
        bio: '',
    });

    // Preferences form state
    const [preferenceData, setPreferenceData] = useState({
        groupSize: 'Small',
        studyStyle: 'Visual',
    });

    // Availability form state
    const [availabilityData, setAvailabilityData] = useState({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
    });

    // Course addition form state
    const [selectedCourse, setSelectedCourse] = useState('');


    useEffect(() => {
        const fetchProfile = async () => {
            if (!session) return;

            setLoading(true);
            setError('');

            try {
                // Fetch user data
                const userRes = await fetch('/api/users/profile');
                if (!userRes.ok) {
                    throw new Error(`Failed to fetch profile: ${userRes.status}`);
                }
                const userData = await userRes.json();
                setUser(userData);

                // Fill profile form
                setProfileData({
                    name: userData.name || '',
                    major: userData.major || '',
                    yearOfStudy: userData.yearOfStudy || '',
                    bio: userData.bio || '',
                });

                // Fill preferences if they exist
                if (userData.preferences) {
                    setPreferenceData({
                        groupSize: userData.preferences.groupSize || 'Small',
                        studyStyle: userData.preferences.studyStyle || 'Visual',
                    });
                }

                // Fetch user courses
                const userCoursesRes = await fetch('/api/users/courses');
                if (!userCoursesRes.ok) {
                    throw new Error(`Failed to fetch user courses: ${userCoursesRes.status}`);
                }
                const userCoursesData = await userCoursesRes.json();
                setCourses(userCoursesData);

                // Fetch all available courses
                const allCoursesRes = await fetch('/api/courses');
                if (!allCoursesRes.ok) {
                    throw new Error(`Failed to fetch courses: ${allCoursesRes.status}`);
                }
                const allCoursesData = await allCoursesRes.json();
                setAvailableCourses(allCoursesData);

                // Fetch user availabilities
                const availabilitiesRes = await fetch('/api/users/availability');
                if (!availabilitiesRes.ok) {
                    throw new Error(`Failed to fetch availabilities: ${availabilitiesRes.status}`);
                }
                const availabilitiesData = await availabilitiesRes.json();
                setAvailabilities(availabilitiesData);

            } catch (error) {
                console.error('Error loading profile data:', error);
                setError('Failed to load profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [session]);

    // Form change handlers
    const handleProfileChange = (e) => {
        const {name, value} = e.target;
        setProfileData(prev => ({...prev, [name]: value}));
    };

    const handlePreferenceChange = (e) => {
        const {name, value} = e.target;
        setPreferenceData(prev => ({...prev, [name]: value}));
    };

    const handleAvailabilityChange = (e) => {
        const {name, value} = e.target;
        setAvailabilityData(prev => ({...prev, [name]: value}));
    };

    // Form submit handlers
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error updating profile');
            }

            setMessage('Profile updated successfully');
        } catch (error) {
            console.error('Profile update error:', error);
            setError(error.message || 'Failed to update profile');
        }
    };

    const handlePreferenceSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/users/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferenceData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error updating preferences');
            }

            setMessage('Preferences updated successfully');
        } catch (error) {
            console.error('Preferences update error:', error);
            setError(error.message || 'Failed to update preferences');
        }
    };

    const handleAvailabilitySubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Convert dayOfWeek to number to match API expectations
            const formData = {
                ...availabilityData,
                dayOfWeek: Number(availabilityData.dayOfWeek)
            };

            const response = await fetch('/api/users/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error adding availability');
            }

            // Refresh availabilities after adding
            const updatedAvailabilitiesRes = await fetch('/api/users/availability');
            const updatedAvailabilitiesData = await updatedAvailabilitiesRes.json();
            setAvailabilities(updatedAvailabilitiesData);

            setMessage('Availability added successfully');
        } catch (error) {
            console.error('Availability addition error:', error);
            setError(error.message || 'Failed to add availability');
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            if (!selectedCourse) return;

            const response = await fetch('/api/users/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({courseId: selectedCourse}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error adding course');
            }

            // Refresh courses after adding
            const updatedCoursesRes = await fetch('/api/users/courses');
            const updatedCoursesData = await updatedCoursesRes.json();
            setCourses(updatedCoursesData);

            setSelectedCourse('');
            setMessage('Course added successfully');
        } catch (error) {
            console.error('Course addition error:', error);
            setError(error.message || 'Failed to add course');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        setMessage('');
        setError('');

        try {
            const response = await fetch(`/api/users/courses/${courseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deleting course');
            }

            setCourses(courses.filter(c => c.id !== courseId));
            setMessage('Course removed successfully');
        } catch (error) {
            console.error('Course deletion error:', error);
            setError(error.message || 'Failed to delete course');
        }
    };

    const handleDeleteAvailability = async (availabilityId) => {
        setMessage('');
        setError('');

        try {
            const response = await fetch(`/api/users/availability/${availabilityId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deleting availability slot');
            }

            setAvailabilities(availabilities.filter(a => a.id !== availabilityId));
            setMessage('Availability slot removed successfully');
        } catch (error) {
            console.error('Availability deletion error:', error);
            setError(error.message || 'Failed to delete availability slot');
        }
    };

    // Day of week formatter
    const formatDayOfWeek = (day) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day] || 'Unknown';
    };

    // Time formatter
    const formatTime = (timeString) => {
        if (!timeString) return '';

        try {
            const [hours, minutes] = timeString.split(':');
            return `${hours}:${minutes}`;
        } catch (e) {
            return timeString;
        }
    };

    if (!session || loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header/>
                <div className="flex">
                    <Sidebar activePage="/profile"/>
                    <div className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center">
                            <div
                                className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                            <p>Loading profile data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header/>
            <div className="flex">

                <Sidebar activePage="/profile"/>

                {/* Main Content */}
                <div className="flex-1 w-max max-w-5xl p-6 bg-gray-100">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Your Profile</h1>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
                            {message}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    {/* Profile Form */}
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        required
                                        className="w-full border border-gray-300 p-2 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Major</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        name="major"
                                        value={profileData.major}
                                        onChange={handleProfileChange}
                                        className="w-full border border-gray-300 p-2 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Year of Study</label>
                                <div className="flex items-center">
                                    <select
                                        name="yearOfStudy"
                                        value={profileData.yearOfStudy}
                                        onChange={handleProfileChange}
                                        className="w-full border border-gray-300 p-2 rounded-md appearance-none"
                                    >
                                        <option value="">Select year</option>
                                        <option value="1">1st year</option>
                                        <option value="2">2nd year</option>
                                        <option value="3">3rd year</option>
                                        <option value="4">4th year</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Bio</label>
                                <div className="flex items-start">
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleProfileChange}
                                        className="w-full border border-gray-300 p-2 rounded-md"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
                            >
                                Save Profile
                            </button>
                        </form>
                    </div>

                    {/* Preferences Form */}
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Study Preferences</h2>
                        <form onSubmit={handlePreferenceSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Group Size</label>
                                <div className="flex items-center">
                                    <select
                                        name="groupSize"
                                        value={preferenceData.groupSize}
                                        onChange={handlePreferenceChange}
                                        className="w-full border border-gray-300 p-2 rounded-md appearance-none"
                                    >
                                        <option value="Individual">Individual</option>
                                        <option value="Small">Small group (2-3 people)</option>
                                        <option value="Large">Large group (4+ people)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Study Style</label>
                                <div className="flex items-center">
                                    <select
                                        name="studyStyle"
                                        value={preferenceData.studyStyle}
                                        onChange={handlePreferenceChange}
                                        className="w-full border border-gray-300 p-2 rounded-md appearance-none"
                                    >
                                        <option value="Visual">Visual (diagrams, videos)</option>
                                        <option value="Reading">Reading/Writing (notes, texts)</option>
                                        <option value="Discussion">Discussion (discussions, explanations)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
                            >
                                Save Preferences
                            </button>
                        </form>
                    </div>

                    {/* Availability Form */}
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Study Availability</h2>

                        {/* List of current availabilities */}
                        {availabilities.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-md font-medium mb-2">Current Availabilities</h3>
                                <ul className="border rounded-lg divide-y">
                                    {availabilities.map((availability) => (
                                        <li key={availability.id} className="p-3 flex justify-between items-center">
                                            <div>
                                                <span
                                                    className="font-medium">{formatDayOfWeek(availability.dayOfWeek)}</span>
                                                <span className="text-gray-600 ml-2">
                                                    {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAvailability(availability.id)}
                                                className="px-3 py-1 border border-red-300 text-red-500 rounded hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Day of the Week</label>
                                <div className="flex items-center">
                                    <select
                                        name="dayOfWeek"
                                        value={availabilityData.dayOfWeek}
                                        onChange={handleAvailabilityChange}
                                        className="w-full border border-gray-300 p-2 rounded-md appearance-none"
                                    >
                                        <option value={1}>Monday</option>
                                        <option value={2}>Tuesday</option>
                                        <option value={3}>Wednesday</option>
                                        <option value={4}>Thursday</option>
                                        <option value={5}>Friday</option>
                                        <option value={6}>Saturday</option>
                                        <option value={0}>Sunday</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Time</label>
                                    <div className="flex items-center">
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={availabilityData.startTime}
                                            onChange={handleAvailabilityChange}
                                            className="w-full border border-gray-300 p-2 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">End Time</label>
                                    <div className="flex items-center">
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={availabilityData.endTime}
                                            onChange={handleAvailabilityChange}
                                            className="w-full border border-gray-300 p-2 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
                            >
                                Add Availability
                            </button>
                        </form>
                    </div>

                    {/* Courses Management */}
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Your Courses</h2>

                        {courses.length === 0 ? (
                            <p className="mb-4">You have no courses yet</p>
                        ) : (
                            <ul className="mb-4 border rounded-lg divide-y">
                                {courses.map(course => (
                                    <li key={course.id} className="p-3 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className="mr-2">•</span>
                                            <span>{course.code}: {course.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="px-3 py-1 border border-red-300 text-red-500 rounded hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Add Course</label>
                                <div className="flex items-center">
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded-md appearance-none"
                                    >
                                        <option value="">Select course</option>
                                        {availableCourses
                                            .filter(course => !courses.some(c => c.id === course.id))
                                            .map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.code}: {course.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedCourse}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
                            >
                                Add Course
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}