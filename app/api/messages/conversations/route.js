// app/api/messages/conversations/route.js - Получение списка бесед
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Не авторизован' },
                { status: 401 }
            );
        }

        const currentUserId = session.user.id;

        // Находим всех пользователей, с которыми текущий пользователь обменивался сообщениями
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

        // Создаем Map для хранения последних сообщений по каждому пользователю
        const conversationsMap = new Map();

        // Добавляем отправленные сообщения
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

        // Добавляем полученные сообщения
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

        // Преобразуем Map в массив и сортируем по дате последнего сообщения (сначала новые)
        const conversations = Array.from(conversationsMap.values())
            .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Ошибка получения бесед:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при получении списка бесед' },
            { status: 500 }
        );
    }
}