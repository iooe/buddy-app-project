import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, major, yearOfStudy } = body;

        // Check required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Required fields not specified' },
                { status: 400 }
            );
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                major,
                yearOfStudy,
            },
        });

        // Create empty preferences
        await prisma.userPreference.create({
            data: {
                userId: user.id,
                groupSize: 'Small',
                studyStyle: 'Visual',
            },
        });

        return NextResponse.json(
            { message: 'User successfully registered' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}