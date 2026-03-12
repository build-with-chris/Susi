import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NavUserButton } from "@/app/components/NavUserButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "InstaGame", template: "%s | InstaGame" },
  description: "Social Media Plan – Video-Übersicht",
  icons: { icon: "/icon" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="de" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        >
          <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
            <nav className="mx-auto flex min-h-[56px] max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-0 sm:min-h-16 lg:px-8">
              <a
                href="/"
                className="min-h-[44px] min-w-[44px] flex items-center text-lg font-bold tracking-tight text-zinc-900 dark:text-white sm:text-xl"
              >
                InstaGame
              </a>
              <div className="flex items-center gap-1 sm:gap-4">
                <a
                  href="/susanne-hoyer"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:active:bg-zinc-700 sm:px-0 sm:min-w-0"
                >
                  Susanne Hoyer
                </a>
                <NavUserButton />
              </div>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
