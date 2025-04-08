import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                {message: 'Not authorized'},
                {status: 401}
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
                {message: 'User not found'},
                {status: 404}
            );
        }

        // Remove password from the response
        const {password, ...userWithoutPassword} = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error getting profile:', error);
        return NextResponse.json(
            {message: 'An error occurred while retrieving the profile'},
            {status: 500}
        );
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                {message: 'Not authorized'},
                {status: 401}
            );
        }

        const body = await request.json();
        const {name, major, yearOfStudy, bio} = body;

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

        // Remove password from the response
        const {password, ...userWithoutPassword} = updatedUser;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            {message: 'An error occurred while updating the profile'},
            {status: 500}
        );
    }
}