import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { getServerSession, Session } from "next-auth";
import SessionProviderWrapper from "@/lib/SessionPrivder";
import { options } from "./api/auth/[...nextauth]/options";

interface RootLayoutProps {
  children: ReactNode; // Type for children elements
  params: {
    session?: Session | null; // Optional session prop
    [key: string]: any; // Allow other params
  };
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FiscalGem",
  description: "FiscalGem",
};



export default async function RootLayout({ children }: RootLayoutProps) {

  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}