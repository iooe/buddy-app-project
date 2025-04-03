// app/profile/[userId]/page.jsx - View another user's profile
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import PageHeader from '@/components/layout/PageHeader';

export default function UserProfile() {
    const { userId } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check if it's the user's own profile
    const isOwnProfile = session?.user?.id === userId;

    useEffect(() => {
        if (isOwnProfile) {
            router.replace('/profile');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                // Fetch user data
                const userRes = await fetch(`/api/users/${userId}`);

                if (!userRes.ok) {
                    throw new Error('Failed to load user profile');
                }

                const userData = await userRes.json();
                setUser(userData);

                // Fetch user courses
                const coursesRes = await fetch(`/api/users/${userId}/courses`);

                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    setCourses(coursesData);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, isOwnProfile, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    if (!user) {
        return <Alert type="error" message="User not found" />;
    }

    return (
        <div>
            <PageHeader
                title={`Profile: ${user.name}`}
                actions={
                    <Link href={`/messages/${userId}`}>
                        <Button>Send Message</Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Information */}
                <Card title="Information" className="md:col-span-2">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Name</h4>
                            <p className="mt-1">{user.name}</p>
                        </div>

                        {user.major && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Major</h4>
                                <p className="mt-1">{user.major}</p>
                            </div>
                        )}

                        {user.yearOfStudy && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Year of Study</h4>
                                <p className="mt-1">{user.yearOfStudy}</p>
                            </div>
                        )}

                        {user.bio && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                                <p className="mt-1">{user.bio}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Preferences */}
                <Card title="Preferences">
                    {user.preferences ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Group Size</h4>
                                <p className="mt-1">
                                    {user.preferences.groupSize === 'Individual' && 'Individual'}
                                    {user.preferences.groupSize === 'Small' && 'Small group'}
                                    {user.preferences.groupSize === 'Large' && 'Large group'}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Study Style</h4>
                                <p className="mt-1">
                                    {user.preferences.studyStyle === 'Visual' && 'Visual'}
                                    {user.preferences.studyStyle === 'Reading' && 'Reading/Writing'}
                                    {user.preferences.studyStyle === 'Discussion' && 'Discussion'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Preferences not specified</p>
                    )}
                </Card>

                {/* Courses */}
                <Card title="Courses" className="md:col-span-3">
                    {courses.length === 0 ? (
                        <p className="text-gray-500">No courses added</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map(course => (
                                <li key={course.id} className="border rounded-lg p-3">
                                    <h4 className="font-medium">{course.code}</h4>
                                    <p className="text-sm text-gray-600">{course.name}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
}
