import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Not authorized' },
                { status: 401 }
            );
        }

        const currentUserId = session.user.id;

        // Find all users with whom the current user has exchanged messages
        const sentMessages = await prisma.message.findMany({
            where: {
                senderId: currentUserId,
            },
            select: {
                receiverId: true,
                receiver: {
                    select: {
                        name: true,
                    },
                },
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const receivedMessages = await prisma.message.findMany({
            where: {
                receiverId: currentUserId,
            },
            select: {
                senderId: true,
                sender: {
                    select: {
                        name: true,
                    },
                },
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Create a Map to store the latest messages for each user
        const conversationsMap = new Map();

        // Add sent messages
        for (const message of sentMessages) {
            const userId = message.receiverId;

            if (!conversationsMap.has(userId) || new Date(message.createdAt) > new Date(conversationsMap.get(userId).lastMessageDate)) {
                conversationsMap.set(userId, {
                    userId,
                    userName: message.receiver.name,
                    lastMessage: message.content,
                    lastMessageDate: message.createdAt,
                });
            }
        }

        // Add received messages
        for (const message of receivedMessages) {
            const userId = message.senderId;

            if (!conversationsMap.has(userId) || new Date(message.createdAt) > new Date(conversationsMap.get(userId).lastMessageDate)) {
                conversationsMap.set(userId, {
                    userId,
                    userName: message.sender.name,
                    lastMessage: message.content,
                    lastMessageDate: message.createdAt,
                });
            }
        }

        // Convert Map to array and sort by the date of the last message (newest first)
        const conversations = Array.from(conversationsMap.values())
            .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Error getting conversations:', error);
        return NextResponse.json(
            { message: 'An error occurred while retrieving the list of conversations' },
            { status: 500 }
        );
    }
}