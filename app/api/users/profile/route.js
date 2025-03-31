// app/api/users/profile/route.js - Профиль пользователя
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

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
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
        console.error('Ошибка получения профиля:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при получении профиля' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Не авторизован' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, major, yearOfStudy, bio } = body;

        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                name,
                major,
                yearOfStudy,
                bio,
            },
        });

        // Удаляем пароль из ответа
        const { password, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при обновлении профиля' },
            { status: 500 }
        );
    }
}