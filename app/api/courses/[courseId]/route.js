
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Error: Not authorized' },
                { status: 401 }
            );
        }

        const { courseId } = params;

        const userCourse = await prisma.userCourse.findFirst({
            where: {
                userId: session.user.id,
                courseId,
            },
        });

        if (!userCourse) {
            return NextResponse.json(
                { message: 'Error: Course wasn\'t found' },
                { status: 404 }
            );
        }

        await prisma.userCourse.delete({
            where: {
                id: userCourse.id,
            },
        });

        return NextResponse.json({ message: 'Success!' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Error' },
            { status: 500 }
        );
    }
}
