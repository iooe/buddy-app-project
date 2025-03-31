import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const availability = await prisma.availability.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' },
            ],
        });

        return NextResponse.json(availability);
    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json(
            { message: 'An error occurred while fetching availability' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { dayOfWeek, startTime, endTime } = body;

        // Check required fields
        if (dayOfWeek === undefined || !startTime || !endTime) {
            return NextResponse.json(
                { message: 'Required fields are missing' },
                { status: 400 }
            );
        }

        // Validate time interval
        if (startTime >= endTime) {
            return NextResponse.json(
                { message: 'End time must be later than start time' },
                { status: 400 }
            );
        }

        // Add availability
        const newAvailability = await prisma.availability.create({
            data: {
                userId: session.user.id,
                dayOfWeek,
                startTime,
                endTime,
            },
        });

        return NextResponse.json(newAvailability);
    } catch (error) {
        console.error('Error adding availability:', error);
        return NextResponse.json(
            { message: 'An error occurred while adding availability' },
            { status: 500 }
        );
    }
}