
// app/api/messages/route.js - Отправка сообщений
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Не авторизован' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { receiverId, content } = body;

        if (!receiverId || !content) {
            return NextResponse.json(
                { message: 'Не указаны обязательные поля' },
                { status: 400 }
            );
        }

        // Проверка существования получателя
        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverId,
            },
        });

        if (!receiver) {
            return NextResponse.json(
                { message: 'Получатель не найден' },
                { status: 404 }
            );
        }

        // Создание сообщения
        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId,
            },
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при отправке сообщения' },
            { status: 500 }
        );
    }
}
