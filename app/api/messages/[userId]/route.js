
// app/api/messages/[userId]/route.js - Получение переписки с пользователем
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Не авторизован' },
                { status: 401 }
            );
        }

        const { userId } = params;
        const currentUserId = session.user.id;

        // Получаем сообщения в обоих направлениях
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
        console.error('Ошибка получения сообщений:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при получении сообщений' },
            { status: 500 }
        );
    }
}

