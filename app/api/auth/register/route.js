// app/api/auth/register/route.js - Регистрация
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, major, yearOfStudy } = body;

        // Проверка обязательных полей
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Не указаны обязательные поля' },
                { status: 400 }
            );
        }

        // Проверка на существующего пользователя
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Пользователь с таким email уже существует' },
                { status: 400 }
            );
        }

        // Хеширование пароля
        const hashedPassword = await hash(password, 10);

        // Создание пользователя
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                major,
                yearOfStudy,
            },
        });

        // Создание пустых предпочтений
        await prisma.userPreference.create({
            data: {
                userId: user.id,
                groupSize: 'Small',
                studyStyle: 'Visual',
            },
        });

        return NextResponse.json(
            { message: 'Пользователь успешно зарегистрирован' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return NextResponse.json(
            { message: 'Произошла ошибка при регистрации' },
            { status: 500 }
        );
    }
}