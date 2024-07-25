"use client"

import IconCalendarMonthFill from '@/app/components/icons/IconCalendarMonthFill';

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">

        <div
            className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          <a
              href="/schedules"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
          >

            <div className="text-6xl"><IconCalendarMonthFill/></div>
            <div className="text-4xl font-bold">
              Scheduleman
            </div>
            <div className="text-xl">a distributed task scheduler</div>
          </a>

        </div>

        <div
            className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          <a
              href="https://www.linkedin.com/in/topherzicornell/"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
          >
            by{" "}
            <h2 className="mb-3 text-2xl font-semibold">
              Topher ZiCornell
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
              </span>
            </h2>
          </a>

        </div>
      </main>
  );
}
