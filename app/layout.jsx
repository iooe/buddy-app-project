import {Inter} from 'next/font/google';
import './globals.css';
import SessionProvider from '../components/providers/SessionProvider';

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'Study Buddy - Find the perfect study partner',
    description: 'Platform for finding study partners based on common courses and preferences',
};

export default function RootLayout({children}) {
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