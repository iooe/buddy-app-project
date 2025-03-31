// app/api/users/[userId]/route.js - Профиль конкретного пользователя
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

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                preferences: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Пользователь не найден' },
                { status: 404 }
            );
        }

        // Удаляем пароль из ответа
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при получении данных пользователя' },
            { status: 500 }
        );
    }
}