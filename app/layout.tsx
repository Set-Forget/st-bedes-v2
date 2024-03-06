import type { Metadata } from "next";

import { GeistSans } from 'geist/font/sans';

import "./globals.css";
import Navbar from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "St Bede's",
  description: "@Setandforget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} text-zinc-950`}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
