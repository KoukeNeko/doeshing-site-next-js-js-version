import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] });


export const metadata = {
  title: "doeshing.site",
  description: "Personal website of doeshing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} min-h-dvh flex flex-col bg-zinc-950 text-zinc-200 antialiased`}>
        <Header />
        <main className="flex-grow pt-0 mx-0 flex items-center justify-center w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
