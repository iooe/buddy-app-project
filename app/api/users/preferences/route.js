// app/api/users/preferences/route.js - Предпочтения пользователя
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

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
        const { groupSize, studyStyle } = body;

        // Обновляем или создаем предпочтения
        const preferences = await prisma.userPreference.upsert({
            where: {
                userId: session.user.id,
            },
            update: {
                groupSize,
                studyStyle,
            },
            create: {
                userId: session.user.id,
                groupSize,
                studyStyle,
            },
        });

        return NextResponse.json(preferences);
    } catch (error) {
        console.error('Ошибка обновления предпочтений:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при обновлении предпочтений' },
            { status: 500 }
        );
    }
}