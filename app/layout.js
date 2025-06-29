import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Inter } from "next/font/google";
import Providers from "./providers";

import BgBall from "@/components/effect/bg_ball";
import TrailingCursor from "@/components/effect/TrailingCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>doeshing.site</title>
        <meta name="description" content="Personal website of doeshing" />
      </head>
      <body
        style={{
          backgroundColor: "#09090b",
          minHeight: "100dvh",
        }}
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} min-h-dvh flex flex-col bg-zinc-950 text-zinc-200 antialiased`}
      >
        <Providers>
          <Header>
            <meta name="theme-color" content="#09090b" />
          </Header>
          <main className="flex-grow pt-0 mx-0 flex items-center justify-center w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
      <TrailingCursor />
      <BgBall />
    </html>
  );
}
