import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 1. Get the current user's courses
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

        // 2. Find users with shared courses
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

        // 3. Group by user and count shared courses
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

        // 4. Get the current user's preferences
        const userPreferences = await prisma.userPreference.findUnique({
            where: {
                userId,
            },
        });

        // 5. Calculate match percentage for each user
        for (const [matchUserId, matchData] of matchesMap.entries()) {
            // Base coefficient based on the number of shared courses
            let courseMatch = (matchData.sharedCourses.length / userCourseIds.length) * 100;

            // Coefficient based on preferences
            let preferenceMatch = 0;
            if (userPreferences && matchData.preferences) {
                let prefMatchCount = 0;
                let totalPrefs = 0;

                // Match by group size
                if (userPreferences.groupSize === matchData.preferences.groupSize) {
                    prefMatchCount++;
                }
                totalPrefs++;

                // Match by study style
                if (userPreferences.studyStyle === matchData.preferences.studyStyle) {
                    prefMatchCount++;
                }
                totalPrefs++;

                preferenceMatch = (prefMatchCount / totalPrefs) * 100;
            }

            // Final match percentage (70% - courses, 30% - preferences)
            matchData.matchPercentage = Math.round((courseMatch * 0.7) + (preferenceMatch * 0.3));
        }

        // 6. Convert Map to array and sort by descending match percentage
        const matches = Array.from(matchesMap.values())
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        return NextResponse.json(matches);
    } catch (error) {
        console.error('Error in matching algorithm:', error);
        return NextResponse.json(
            { message: 'An error occurred while finding study partners' },
            { status: 500 }
        );
    }
}