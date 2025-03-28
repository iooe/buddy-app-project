import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
    try {
        console.log('API: Fetching courses');
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('API: Unauthorized - No session');
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const courses = await prisma.course.findMany({
            orderBy: {
                code: 'asc',
            },
        });

        console.log(`API: Found ${courses.length} courses`);
        return NextResponse.json(courses);
    } catch (error) {
        console.error('API Error fetching courses:', error);
        return NextResponse.json(
            { message: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}