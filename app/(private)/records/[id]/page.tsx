import { getSpeechServer } from "@/lib/server-api";
import { SpeechDetailClient } from "@/components/speech/SpeechDetailClient";

interface RecordPageProps {
  params: Promise<{ id: string }>;
}

export default async function Record({ params }: RecordPageProps) {
  const { id } = await params;
  const speech = await getSpeechServer(id);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-6 bg-white dark:bg-black sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {speech?.title ?? "Record"}
          </h1>

          <section className="w-full">
            {!speech ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Не вдалося завантажити промову.
              </p>
            ) : speech.blocks.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                У промові ще немає блоків.
              </p>
            ) : (
              <SpeechDetailClient speech={speech} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
