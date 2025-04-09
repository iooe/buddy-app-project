import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter both email and password");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        throw new Error("No account found with this email");
                    }

                    const isPasswordValid = await compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Incorrect password");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                } catch (error) {
                    // Check if it's our custom error or a database/system error
                    if (error.message === "No account found with this email" ||
                        error.message === "Incorrect password" ||
                        error.message === "Please enter both email and password") {
                        throw error;
                    } else {
                        // For other errors (database issues, etc.), provide a generic message
                        console.error("Auth error:", error);
                        throw new Error("Authentication failed. Please try again later.");
                    }
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
    },
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };