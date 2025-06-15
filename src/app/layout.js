"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Navbar from "@/components/shared/navbar";
// import '@/styles/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "NextPen",
//   description: "A Blog Sharing Platform for Developers",
// };

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <html lang="en">
         <body className="bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto">{children}</main>
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
