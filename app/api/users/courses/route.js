import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
    try {
        console.log('API: Fetching user courses');
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('API: Unauthorized - No session');
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        console.log(`API: User ID: ${userId}`);

        const userCourses = await prisma.userCourse.findMany({
            where: {
                userId: userId,
            },
            include: {
                course: true,
            },
        });

        // Format response to just return courses
        const courses = userCourses.map(uc => uc.course);

        console.log(`API: Found ${courses.length} user courses`);
        return NextResponse.json(courses);
    } catch (error) {
        console.error('API Error fetching user courses:', error);
        return NextResponse.json(
            { message: 'Failed to fetch user courses' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        console.log('API: Adding user course');
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('API: Unauthorized - No session');
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const body = await request.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json(
                { message: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.userCourse.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
            },
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { message: 'Already enrolled in this course' },
                { status: 400 }
            );
        }

        // Create enrollment
        await prisma.userCourse.create({
            data: {
                userId: userId,
                courseId: courseId,
            },
        });

        return NextResponse.json(
            { message: 'Course added successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('API Error adding course:', error);
        return NextResponse.json(
            { message: 'Failed to add course' },
            { status: 500 }
        );
    }
}