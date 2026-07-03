import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import SessionProvider from '@/components/SessionProvider';
import ZustandProvider from '@/components/ZustandProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bolt E-Commerce',
  description: 'A production-grade e-commerce platform built with Next.js, Tailwind CSS, Prisma, and Stripe.',
  openGraph: {
    title: 'Bolt E-Commerce',
    description: 'A production-grade e-commerce platform built with Next.js, Tailwind CSS, Prisma, and Stripe.',
    url: 'http://localhost:3000',
    siteName: 'Bolt E-Commerce',
    images: [
      {
        url: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Example image
        width: 800,
        height: 600,
        alt: 'E-Commerce Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bolt E-Commerce',
    description: 'A production-grade e-commerce platform built with Next.js, Tailwind CSS, Prisma, and Stripe.',
    images: ['https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ZustandProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </ZustandProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
