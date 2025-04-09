import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 401 }
            );
        }

        // Access userId directly without destructuring
        const userId = params.userId;
        const currentUserId = session.user.id;

        // Get messages in both directions
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: currentUserId,
                        receiverId: userId,
                    },
                    {
                        senderId: userId,
                        receiverId: currentUserId,
                    },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return NextResponse.json(
            { message: 'An error occurred while retrieving messages' },
            { status: 500 }
        );
    }
}