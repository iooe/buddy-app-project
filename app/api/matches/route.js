
// app/api/matches/route.js - Алгоритм сопоставления
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Не авторизован' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 1. Получаем курсы текущего пользователя
        const userCourses = await prisma.userCourse.findMany({
            where: {
                userId,
            },
            select: {
                courseId: true,
            },
        });

        const userCourseIds = userCourses.map(uc => uc.courseId);

        if (userCourseIds.length === 0) {
            return NextResponse.json([]);
        }

        // 2. Находим пользователей с общими курсами
        const potentialMatches = await prisma.userCourse.findMany({
            where: {
                courseId: {
                    in: userCourseIds,
                },
                userId: {
                    not: userId,
                },
            },
            select: {
                userId: true,
                courseId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        major: true,
                        yearOfStudy: true,
                        preferences: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
            },
        });

        // 3. Группируем по пользователю и считаем общие курсы
        const matchesMap = new Map();

        for (const match of potentialMatches) {
            if (!matchesMap.has(match.userId)) {
                matchesMap.set(match.userId, {
                    id: match.userId,
                    name: match.user.name,
                    major: match.user.major,
                    yearOfStudy: match.user.yearOfStudy,
                    preferences: match.user.preferences,
                    sharedCourses: [match.course],
                    matchPercentage: 0,
                });
            } else {
                const existingMatch = matchesMap.get(match.userId);
                existingMatch.sharedCourses.push(match.course);
            }
        }

        // 4. Получаем предпочтения текущего пользователя
        const userPreferences = await prisma.userPreference.findUnique({
            where: {
                userId,
            },
        });

        // 5. Рассчитываем процент сопоставления для каждого пользователя
        for (const [matchUserId, matchData] of matchesMap.entries()) {
            // Базовый коэффициент на основе количества общих курсов
            let courseMatch = (matchData.sharedCourses.length / userCourseIds.length) * 100;

            // Коэффициент на основе предпочтений
            let preferenceMatch = 0;
            if (userPreferences && matchData.preferences) {
                let prefMatchCount = 0;
                let totalPrefs = 0;

                // Совпадение по размеру группы
                if (userPreferences.groupSize === matchData.preferences.groupSize) {
                    prefMatchCount++;
                }
                totalPrefs++;

                // Совпадение по стилю обучения
                if (userPreferences.studyStyle === matchData.preferences.studyStyle) {
                    prefMatchCount++;
                }
                totalPrefs++;

                preferenceMatch = (prefMatchCount / totalPrefs) * 100;
            }

            // Финальный процент сопоставления (70% - курсы, 30% - предпочтения)
            matchData.matchPercentage = Math.round((courseMatch * 0.7) + (preferenceMatch * 0.3));
        }

        // 6. Преобразуем Map в массив и сортируем по убыванию процента сопоставления
        const matches = Array.from(matchesMap.values())
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        return NextResponse.json(matches);
    } catch (error) {
        console.error('Ошибка в алгоритме сопоставления:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при поиске партнеров' },
            { status: 500 }
        );
    }
}
