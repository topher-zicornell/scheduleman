"use client"

import IconCalendarMonthFill from '@/app/components/icons/IconCalendarMonthFill';

/**
 * The top-level page for this UI.  This presents a splash and hooks to get into the good stuff.
 */
export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">

        <div
            className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          <a
              href="/schedules"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              rel="noopener noreferrer"
          >

            <div className="flex items-center gap-3">
              <div className="text-6xl"><IconCalendarMonthFill/></div>
              <div className="inline-block mb-3 text-4xl font-bold">
                Scheduleman
              </div>
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
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img
                      src={'https://www.gravatar.com/avatar/db8e58cb2cb1757e01b57c6e36c430ac5e507587d99bb5ef72e1d3ef5ad76794'}
                      alt="Topher's Mug"
                  />
                </div>
              </div>
              <div className="mb-3 text-2xl font-semibold">
                Topher ZiCornell
              </div>
              <div
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </div>
            </div>
          </a>

        </div>
      </main>
);
}
