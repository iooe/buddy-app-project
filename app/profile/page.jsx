'use client';

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

import {useSession, signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

// Sample Data (Replace with actual data fetching for the logged-in user)
const initialBasicInfo = {
    name: "Vlad", // Example
    major: "Computing", // Example
    year: "3rd year", // Example
    bio: "Loves algorithms and web development.", // Example
};

const initialStudyPreferences = {
    groupSize: "Small group (2-3 people)", // Example
    studyStyle: "Visual (diagrams, videos)", // Example
};

const initialUserCourses = [
    { code: "MATH121", title: "Calculus I" }, // Example
    // Add more initial courses if needed
];

// Assume these are all possible courses the user could add
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

export default function Profile() {
/*    const {data: session} = useSession();
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
    }*/

    // State for each section
    const [basicInfo, setBasicInfo] = useState(initialBasicInfo);
    const [studyPreferences, setStudyPreferences] = useState(initialStudyPreferences);

    // State for the availability input fields
    const [dayOfWeek, setDayOfWeek] = useState(""); // e.g., "Monday"
    const [startTime, setStartTime] = useState(""); // e.g., "09:00"
    const [endTime, setEndTime] = useState("");   // e.g., "11:00"
    // Note: The image doesn't show a list of added availabilities, just the controls to add one.
    // In a real app, you'd likely have a list state: const [availabilities, setAvailabilities] = useState<Availability[]>([]);

    // State for courses (similar to Courses page)
    const [userCourses, setUserCourses] = useState(initialUserCourses);
    const [selectedCourseCode, setSelectedCourseCode] = useState("");

    // --- Handlers for Basic Info ---
    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    };
    const handleSaveBasicInfo = () => {
        console.log("Saving Basic Info:", basicInfo);
        // TODO: Implement API call to save basic info
        alert("Basic Info Saved (simulated)");
    };

    // --- Handlers for Study Preferences ---
    const handlePreferenceChange = (e) => {
        const { name, value } = e.target;
        setStudyPreferences(prev => ({ ...prev, [name]: value }));
    };
    const handleSavePreferences = () => {
        console.log("Saving Preferences:", studyPreferences);
        // TODO: Implement API call to save preferences
        alert("Preferences Saved (simulated)");
    };

    // --- Handlers for Study Availability ---
    const handleAddAvailability = () => {
        if (!dayOfWeek || !startTime || !endTime) {
            alert("Please select day, start time, and end time.");
            return;
        }
        const newAvailabilityEntry = { day: dayOfWeek, startTime, endTime };
        console.log("Adding Availability:", newAvailabilityEntry);
        // TODO: Implement API call to add availability (or add to a list state)
        alert(`Availability Added: ${dayOfWeek} ${startTime}-${endTime} (simulated)`);
        // Optionally clear fields after adding
        // setDayOfWeek(""); setStartTime(""); setEndTime("");
    };

    // --- Handlers for Courses (Reused logic) ---
    const coursesToAdd = useMemo(() => {
        const userCourseCodes = new Set(userCourses.map(course => course.code));
        return allAvailableCourses.filter(course => !userCourseCodes.has(course.code));
    }, [userCourses]);

    const handleRemoveCourse = (courseCodeToRemove) => {
        setUserCourses(currentCourses =>
            currentCourses.filter(course => course.code !== courseCodeToRemove)
        );
        // TODO: Add API call to remove course from user profile
        console.log("Removing course:", courseCodeToRemove);
    };

    const handleAddCourse = () => {
        if (!selectedCourseCode) return;
        const courseToAdd = allAvailableCourses.find(course => course.code === selectedCourseCode);
        if (courseToAdd && !userCourses.some(c => c.code === courseToAdd.code)) {
            setUserCourses(currentCourses => [...currentCourses, courseToAdd]);
            // TODO: Add API call to add course to user profile
            console.log("Adding course:", courseToAdd);
            setSelectedCourseCode(""); // Reset dropdown
        }
    };

    const handleCourseSelectChange = (event) => {
        setSelectedCourseCode(event.target.value);
    };

    // --- Exit Handler ---
    const handleExit = async () => {
        console.log("Exit clicked - implement logout logic here");
    };

    // --- Render ---
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
                            <li className="mb-2">
                                <Link href="/messages" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-200">
                                    <span className="mr-3 h-5 w-5"></span> Messages
                                </Link>
                            </li>
                            {/* Active state applied to Profile */}
                            <li className="mb-2">
                                <Link href="/profile" className="flex items-center p-2 rounded-md bg-blue-100 text-blue-700 font-semibold">
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
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Profile</h2>

                    {/* Basic Information Section */}
                    <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Basic Information</h3>
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={basicInfo.name}
                                    onChange={handleBasicInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            {/* Major */}
                            <div>
                                <label htmlFor="major" className="block text-sm font-medium text-gray-600 mb-1">Major</label>
                                <input
                                    type="text"
                                    id="major"
                                    name="major"
                                    value={basicInfo.major}
                                    onChange={handleBasicInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            {/* Year of Study */}
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-600 mb-1">Year of Study</label>
                                <select
                                    id="year"
                                    name="year"
                                    value={basicInfo.year}
                                    onChange={handleBasicInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Select Year...</option>
                                    <option value="1st year">1st year</option>
                                    <option value="2nd year">2nd year</option>
                                    <option value="3rd year">3rd year</option>
                                    <option value="4th year">4th year</option>
                                    <option value="5th year+">5th year+</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>
                            {/* Bio */}
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    value={basicInfo.bio}
                                    onChange={handleBasicInfoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                ></textarea>
                            </div>
                            {/* Save Button */}
                            <div className="text-right">
                                <button
                                    onClick={handleSaveBasicInfo}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Study Preferences Section */}
                    <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Study Preferences</h3>
                        <div className="space-y-4">
                            {/* Group Size */}
                            <div>
                                <label htmlFor="groupSize" className="block text-sm font-medium text-gray-600 mb-1">Group Size</label>
                                <select
                                    id="groupSize"
                                    name="groupSize"
                                    value={studyPreferences.groupSize}
                                    onChange={handlePreferenceChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Select Group Size...</option>
                                    <option value="Solo">Solo</option>
                                    <option value="Pairs">Pairs</option>
                                    <option value="Small group (2-3 people)">Small group (2-3 people)</option>
                                    <option value="Medium group (4-5 people)">Medium group (4-5 people)</option>
                                    <option value="Large group (6+ people)">Large group (6+ people)</option>
                                    <option value="Any">Any</option>
                                </select>
                            </div>
                            {/* Study Style */}
                            <div>
                                <label htmlFor="studyStyle" className="block text-sm font-medium text-gray-600 mb-1">Study Style</label>
                                <select
                                    id="studyStyle"
                                    name="studyStyle"
                                    value={studyPreferences.studyStyle}
                                    onChange={handlePreferenceChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Select Study Style...</option>
                                    <option value="Visual (diagrams, videos)">Visual (diagrams, videos)</option>
                                    <option value="Auditory (listening, discussion)">Auditory (listening, discussion)</option>
                                    <option value="Reading/Writing">Reading/Writing</option>
                                    <option value="Kinesthetic (hands-on)">Kinesthetic (hands-on)</option>
                                    <option value="Quiet Study">Quiet Study</option>
                                    <option value="Collaborative Discussion">Collaborative Discussion</option>
                                    <option value="Problem Solving Focused">Problem Solving Focused</option>
                                    <option value="Teaching Others">Teaching Others</option>
                                </select>
                            </div>
                            {/* Save Button */}
                            <div className="text-right">
                                <button
                                    onClick={handleSavePreferences}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                                >
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Study Availability Section */}
                    <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Study Availability</h3>
                        <div className="space-y-4">
                            {/* Day of the Week */}
                            <div>
                                <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-600 mb-1">Day of the Week</label>
                                <select
                                    id="dayOfWeek"
                                    name="dayOfWeek"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="">Select Day...</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                            {/* Start & End Time */}
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            {/* Add Button */}
                            <div className="text-right">
                                <button
                                    onClick={handleAddAvailability}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                                >
                                    Add Availability
                                </button>
                            </div>
                            {/* TODO: Add display list for added availabilities here if needed */}
                        </div>
                    </section>


                    {/* Your Courses Section (Similar to Courses Page) */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Courses</h3>
                        {/* Display Current Courses */}
                        {userCourses.length > 0 ? (
                            <div className="space-y-3 mb-6">
                                {userCourses.map((course) => (
                                    <div key={course.code} className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                                        <span className="text-gray-800 font-medium text-sm">
                                            <span className="list-disc list-inside mr-2">•</span> {/* Bullet point */}
                                            {course.code} - {course.title}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveCourse(course.code)}
                                            className="text-red-600 bg-white border border-red-300 hover:bg-red-50 px-3 py-1 rounded-md text-xs font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mb-6">You haven't added any courses yet.</p>
                        )}

                        {/* Add New Course */}
                        <h4 className="text-md font-semibold text-gray-600 mb-3">Add Course</h4>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedCourseCode}
                                onChange={handleCourseSelectChange}
                                className="block w-full md:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                            >
                                <option value="">Select course to add...</option>
                                {coursesToAdd.map((course) => (
                                    <option key={course.code} value={course.code}>
                                        {course.code} - {course.title}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddCourse}
                                disabled={!selectedCourseCode}
                                className={`px-4 py-2 rounded-md text-sm font-medium text-white
                                            ${!selectedCourseCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                Add Course
                            </button>
                        </div>
                        {coursesToAdd.length === 0 && userCourses.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">All available courses have been added.</p>
                        )}
                    </section>

                </main>
            </div>
        </div>
    );
}