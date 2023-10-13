'use client'
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import {queryClient,  QueryClientProvider } from './queryClient';

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
