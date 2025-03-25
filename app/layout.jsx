import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import SessionProvider from '../components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Study Buddy - Найдите идеального партнера для учебы',
    description: 'Платформа для поиска партнеров для совместной учебы на основе общих курсов и предпочтений',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider>
            {children}
        </SessionProvider>
        </body>
        </html>
    );
}