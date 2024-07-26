
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import IconCalendarMonthFill from '@/app/components/icons/IconCalendarMonthFill';
import {Suspense} from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scheduleman Console",
  description: "User Console for the Scheduleman system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="h-full bg-white">
        <body className={`h-full ${inter.className}`}>
          <nav
              className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
            <div className="mb-2 sm:mb-0">
              <a href="/"
                 className="text-2xl no-underline text-grey-darkest hover:text-blue-dark">
                <div className="flex items-center gap-3">
                  <div className="text-6xl"><IconCalendarMonthFill/></div>
                  <div className="text-2xl font-bold">Scheduleman</div>
                </div>
              </a>
            </div>
            <div className="flex flex-row">
              ...
            </div>
          </nav>
          <div className="flex flex-col flex-1">
            <Suspense>
              {children}
            </Suspense>
          </div>
        </body>
      </html>
  );
}

