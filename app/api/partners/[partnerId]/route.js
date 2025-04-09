import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma'; // Assuming you use Prisma - adjust as needed

export async function GET(request, { params }) {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { partnerId } = params;

    try {
        // Fetch the partner from database
        const partner = await prisma.user.findUnique({
            where: { id: partnerId },
            include: {
                preferences: true,
                courses: {
                    include: {
                        course: true,
                    },
                },
                availability: true,
            },
        });

        if (!partner) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        // Format the response to match the expected structure
        const formattedPartner = {
            id: partner.id,
            name: partner.name,
            major: partner.major || '',
            yearOfStudy: partner.yearOfStudy || '',
            bio: partner.bio || '',
            preferences: {
                groupSize: partner.preferences?.groupSize || '',
                studyStyle: partner.preferences?.studyStyle || '',
            },
            courses: partner.courses.map(userCourse => ({
                code: userCourse.course.code,
                title: userCourse.course.name, // Map 'name' from schema to 'title' for frontend
            })),
            availability: partner.availability.map(slot => {
                // Convert dayOfWeek number to day name
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return {
                    day: days[slot.dayOfWeek],
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                };
            }),
        };

        return NextResponse.json(formattedPartner);
    } catch (error) {
        console.error('Error fetching partner data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch partner data' },
            { status: 500 }
        );
    }
}