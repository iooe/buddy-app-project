import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
    try {
        console.log('API: Removing user course');
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('API: Unauthorized - No session');
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { courseId } = params;

        console.log(`API: Removing course ${courseId} for user ${userId}`);

        // Find the enrollment
        const enrollment = await prisma.userCourse.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
            },
        });

        if (!enrollment) {
            return NextResponse.json(
                { message: 'Enrollment not found' },
                { status: 404 }
            );
        }

        // Delete enrollment
        await prisma.userCourse.delete({
            where: {
                id: enrollment.id,
            },
        });

        return NextResponse.json(
            { message: 'Course removed successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error removing course:', error);
        return NextResponse.json(
            { message: 'Failed to remove course' },
            { status: 500 }
        );
    }
}