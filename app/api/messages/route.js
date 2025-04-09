import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { receiverId, content } = body;

        if (!receiverId || !content) {
            return NextResponse.json(
                { message: 'Required fields not specified' },
                { status: 400 }
            );
        }

        // Check if recipient exists
        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverId,
            },
        });

        if (!receiver) {
            return NextResponse.json(
                { message: 'Recipient not found' },
                { status: 404 }
            );
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId,
            },
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { message: 'An error occurred while sending the message' },
            { status: 500 }
        );
    }
}