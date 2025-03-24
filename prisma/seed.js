
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Начинаем заполнение базы данных...');

    // Создаем курсы
    const courses = [
        { code: 'MATH101', name: 'Calculus I' },
        { code: 'PHYS101', name: 'Introduction to Physics' },
        { code: 'CS101', name: 'Introduction to Programming' },
        { code: 'CS201', name: 'Data Structures' },
        { code: 'ENG101', name: 'English Composition' },
        { code: 'HIST101', name: 'World History' },
        { code: 'BIO101', name: 'Introduction to Biology' },
        { code: 'CHEM101', name: 'General Chemistry' },
        { code: 'ECON101', name: 'Principles of Economics' },
        { code: 'PSY101', name: 'Introduction to Psychology' },
    ];

    console.log('Создаем курсы...');
    for (const course of courses) {
        await prisma.course.upsert({
            where: { code: course.code },
            update: {},
            create: course,
        });
    }

    // Создаем тестовых пользователей
    const users = [
        {
            email: 'john@example.com',
            name: 'John Doe',
            password: await hash('password123', 10),
            major: 'Computer Science',
            yearOfStudy: '2',
            bio: 'I love coding and math!',
            preferences: {
                groupSize: 'Small',
                studyStyle: 'Visual',
            },
            courses: ['CS101', 'CS201', 'MATH101'],
            availability: [
                { dayOfWeek: 1, startTime: '10:00', endTime: '12:00' },
                { dayOfWeek: 3, startTime: '14:00', endTime: '16:00' },
                { dayOfWeek: 5, startTime: '09:00', endTime: '11:00' },
            ],
        },
        {
            email: 'alice@example.com',
            name: 'Alice Smith',
            password: await hash('password123', 10),
            major: 'Physics',
            yearOfStudy: '3',
            bio: 'Physics enthusiast, always eager to learn!',
            preferences: {
                groupSize: 'Small',
                studyStyle: 'Discussion',
            },
            courses: ['PHYS101', 'MATH101', 'CHEM101'],
            availability: [
                { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
                { dayOfWeek: 2, startTime: '13:00', endTime: '15:00' },
                { dayOfWeek: 4, startTime: '10:00', endTime: '12:00' },
            ],
        },
        {
            email: 'bob@example.com',
            name: 'Bob Johnson',
            password: await hash('password123', 10),
            major: 'Biology',
            yearOfStudy: '2',
            bio: 'Biology student. I also enjoy chemistry.',
            preferences: {
                groupSize: 'Large',
                studyStyle: 'Reading',
            },
            courses: ['BIO101', 'CHEM101', 'ENG101'],
            availability: [
                { dayOfWeek: 2, startTime: '11:00', endTime: '13:00' },
                { dayOfWeek: 4, startTime: '15:00', endTime: '17:00' },
                { dayOfWeek: 6, startTime: '10:00', endTime: '12:00' },
            ],
        },
        {
            email: 'emma@example.com',
            name: 'Emma Wilson',
            password: await hash('password123', 10),
            major: 'Economics',
            yearOfStudy: '4',
            bio: 'Economics major, interested in psychology and statistics.',
            preferences: {
                groupSize: 'Individual',
                studyStyle: 'Visual',
            },
            courses: ['ECON101', 'PSY101', 'MATH101'],
            availability: [
                { dayOfWeek: 1, startTime: '15:00', endTime: '17:00' },
                { dayOfWeek: 3, startTime: '10:00', endTime: '12:00' },
                { dayOfWeek: 5, startTime: '14:00', endTime: '16:00' },
            ],
        },
        {
            email: 'michael@example.com',
            name: 'Michael Brown',
            password: await hash('password123', 10),
            major: 'History',
            yearOfStudy: '3',
            bio: 'History enthusiast, also taking English classes.',
            preferences: {
                groupSize: 'Small',
                studyStyle: 'Discussion',
            },
            courses: ['HIST101', 'ENG101', 'PSY101'],
            availability: [
                { dayOfWeek: 0, startTime: '13:00', endTime: '15:00' },
                { dayOfWeek: 2, startTime: '09:00', endTime: '11:00' },
                { dayOfWeek: 4, startTime: '14:00', endTime: '16:00' },
            ],
        },
    ];

    console.log('Создаем пользователей...');
    for (const userData of users) {
        const { email, name, password, major, yearOfStudy, bio, preferences, courses, availability } = userData;

        // Создаем пользователя
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name,
                password,
                major,
                yearOfStudy,
                bio,
            },
        });

        // Создаем предпочтения
        await prisma.userPreference.upsert({
            where: { userId: user.id },
            update: preferences,
            create: {
                userId: user.id,
                ...preferences,
            },
        });

        // Добавляем курсы
        for (const courseCode of courses) {
            const course = await prisma.course.findUnique({
                where: { code: courseCode },
            });

            if (course) {
                await prisma.userCourse.upsert({
                    where: {
                        userId_courseId: {
                            userId: user.id,
                            courseId: course.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        courseId: course.id,
                    },
                });
            }
        }

        // Добавляем доступность
        for (const slot of availability) {
            await prisma.availability.create({
                data: {
                    userId: user.id,
                    ...slot,
                },
            });
        }
    }

    // Создаем некоторые сообщения между пользователями
    console.log('Создаем сообщения...');

    const john = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
    const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
    const bob = await prisma.user.findUnique({ where: { email: 'bob@example.com' } });

    const messages = [
        {
            senderId: john.id,
            receiverId: alice.id,
            content: 'Привет! Хочешь позаниматься вместе по матану?',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
        },
        {
            senderId: alice.id,
            receiverId: john.id,
            content: 'Привет! Да, конечно! Когда тебе удобно?',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 3 дня назад + 30 минут
        },
        {
            senderId: john.id,
            receiverId: alice.id,
            content: 'Может в понедельник в 10:00?',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 3 дня назад + 45 минут
        },
        {
            senderId: alice.id,
            receiverId: john.id,
            content: 'Отлично! Давай встретимся в библиотеке.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 3 дня назад + 1 час
        },
        {
            senderId: bob.id,
            receiverId: john.id,
            content: 'Привет! Слышал, ты хорошо разбираешься в программировании. Можешь помочь мне с заданием?',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 день назад
        },
        {
            senderId: john.id,
            receiverId: bob.id,
            content: 'Привет! Конечно, могу помочь. Что у тебя за задание?',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // 1 день назад + 20 минут
        },
    ];

    for (const messageData of messages) {
        await prisma.message.create({
            data: messageData,
        });
    }

    console.log('Заполнение базы данных завершено!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });