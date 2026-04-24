import Link from "next/link";

import { getSpeechesServer } from "@/lib/server-api";

export default async function Records() {
  const speeches = await getSpeechesServer();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-6 bg-white dark:bg-black sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Records
          </h1>

          <section className="w-full">
            {!speeches ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Не вдалося завантажити промови.
              </p>
            ) : speeches.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                У вас ще немає промов.
              </p>
            ) : (
              <ul className="space-y-3">
                {speeches.map((speech) => (
                  <li
                    key={speech.id}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <Link href={`/records/${speech.id}`}>
                      <h2 className="text-base font-medium text-black dark:text-zinc-100">
                        {speech.title}
                      </h2>

                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Blocks: {speech.blocks.length}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
