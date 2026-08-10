import {
  getSpeechServer,
  SpeechDetailClient,
} from "@/feature/speech";
import { getTtsLanguagesServer } from "@/feature/speech/api/get-tts-languages-server";
import { getTtsModelsServer } from "@/feature/speech/api/get-tts-models-server";

interface RecordPageProps {
  params: Promise<{ id: string }>;
}

export default async function Record({ params }: RecordPageProps) {
  const { id } = await params;
  const [speech, languagesResponse, modelsResponse] = await Promise.all([
    getSpeechServer(id),
    getTtsLanguagesServer(),
    getTtsModelsServer(),
  ]);

  const languages = languagesResponse?.languages ?? [];
  const models = modelsResponse?.models ?? [];
  const recommendedModel = modelsResponse?.recommendedModel ?? "Standard";

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-6 bg-white dark:bg-black sm:px-16">
        <section className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {!speech && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Не вдалося завантажити промову.
            </p>
          )}

          {speech && (
            <SpeechDetailClient
              speech={speech}
              languages={languages}
              models={models}
              recommendedModel={recommendedModel}
            />
          )}
        </section>
      </main>
    </div>
  );
}
