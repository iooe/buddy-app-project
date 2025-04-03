'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Matches() {
    const { data: session } = useSession();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                if (!session) return;

                const response = await fetch('/api/matches');
                const data = await response.json();

                setMatches(data);
            } catch (error) {
                console.error('Ошибка загрузки партнеров:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [session]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Поиск партнеров для учебы</h1>

            {matches.length === 0 ? (
                <div className="bg-yellow-100 p-4 rounded">
                    <p>Пока не найдено подходящих партнеров. Добавьте больше курсов для лучшего сопоставления.</p>
                    <Link href="/profile#courses" className="text-blue-600 mt-2 inline-block">
                        Управление курсами
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matches.map(match => (
                        <div key={match.id} className="border rounded p-4">
                            <div className="font-bold text-lg">{match.name}</div>
                            <div className="text-gray-600">{match.major}, {match.yearOfStudy} курс</div>

                            <div className="mt-2">
                                <div className="flex justify-between">
                                    <span>Совпадение:</span>
                                    <span className="font-bold">{match.matchPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${match.matchPercentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="font-medium">Общие курсы:</p>
                                <ul className="list-disc list-inside text-sm">
                                    {match.sharedCourses.map(course => (
                                        <li key={course.id}>{course.code}: {course.name}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link
                                    href={`/messages/${match.id}`}
                                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded"
                                >
                                    Написать
                                </Link>
                                <Link
                                    href={`/profile/${match.id}`}
                                    className="flex-1 bg-gray-200 text-center py-2 rounded"
                                >
                                    Профиль
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}