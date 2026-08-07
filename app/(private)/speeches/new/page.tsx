import {
  getTtsLanguagesServer,
} from "@/feature/speech/api/get-tts-languages-server";
import { getTtsModelsServer } from "@/feature/speech/api/get-tts-models-server";
import { CreateSpeechForm } from "@/feature/speech/ui/create/CreateSpeechForm";

export default async function NewSpeechPage() {
  const [languagesResponse, modelsResponse] = await Promise.all([
    getTtsLanguagesServer(),
    getTtsModelsServer(),
  ]);

  const languages = languagesResponse?.languages ?? [];
  const models = modelsResponse?.models ?? [];
  const recommendedModel = modelsResponse?.recommendedModel ?? "Standard";

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 py-12 px-6 bg-white dark:bg-black sm:px-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            New speech
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Create a speech in a few steps: title, blocks, then TTS settings.
          </p>
        </div>

        {languages.length === 0 || models.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Не вдалося завантажити TTS-налаштування. Спробуйте пізніше.
          </p>
        ) : (
          <CreateSpeechForm
            languages={languages}
            models={models}
            recommendedModel={recommendedModel}
          />
        )}
      </main>
    </div>
  );
}
