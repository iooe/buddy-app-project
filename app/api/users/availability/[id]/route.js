import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
    try {
        const availabilityId = params.id;

        if (!availabilityId) {
            return NextResponse.json(
                { message: 'Availability ID is required' },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // First check if the availability belongs to the user
        const availability = await prisma.availability.findUnique({
            where: {
                id: availabilityId
            }
        });

        if (!availability) {
            return NextResponse.json(
                { message: 'Availability slot not found' },
                { status: 404 }
            );
        }

        if (availability.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'You do not have permission to delete this availability slot' },
                { status: 403 }
            );
        }

        // Delete the availability
        await prisma.availability.delete({
            where: {
                id: availabilityId
            }
        });

        return NextResponse.json({
            message: 'Availability slot deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting availability:', error);
        return NextResponse.json(
            { message: 'An error occurred while deleting the availability slot' },
            { status: 500 }
        );
    }
}