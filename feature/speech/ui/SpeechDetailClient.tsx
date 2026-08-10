"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getSpeechAction } from "@/feature/speech/actions/get-speech-action";
import { getSpeechAudioPlayUrlsAction } from "@/feature/speech/actions/get-speech-audio-play-urls-action";
import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";
import type { TtsLanguage } from "@/feature/speech/api/get-tts-languages";
import type { TtsModelInfo } from "@/feature/speech/api/get-tts-models";

import { AudioPlayer } from "@/components/audioPlayer";
import { EditSpeechForm } from "./edit/EditSpeechForm";
import { SpeechHeader } from "./header";

interface SpeechDetailClientProps {
  speech: SpeechDetailResponse;
  languages: TtsLanguage[];
  models: TtsModelInfo[];
  recommendedModel: string;
}

function speechHasPlayableAudio(speech: SpeechDetailResponse | undefined) {
  return Boolean(speech?.blocks.some((block) => Boolean(block.audioUrl)));
}

function speechIsGenerating(speech: SpeechDetailResponse | undefined) {
  return Boolean(
    speech?.blocks.some(
      (block) =>
        block.audioStatus === "PENDING" || block.audioStatus === "PROCESSING",
    ),
  );
}

export function SpeechDetailClient({
  speech,
  languages,
  models,
  recommendedModel,
}: SpeechDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const speechQuery = useQuery({
    queryKey: ["speech", speech.id],
    queryFn: () => getSpeechAction(speech.id),
    initialData: speech,
    refetchInterval: (query) =>
      speechIsGenerating(query.state.data) ? 2000 : false,
  });

  const currentSpeech = speechQuery.data;
  const hasAudio = speechHasPlayableAudio(currentSpeech);

  const audioRevision = useMemo(() => {
    if (!currentSpeech) return "";
    return currentSpeech.blocks
      .map(
        (block) =>
          `${block.id}:${block.audioUrl ?? ""}:${block.audioStatus ?? ""}`,
      )
      .join("|");
  }, [currentSpeech]);

  const playUrlsQuery = useQuery({
    queryKey: ["speech-play-urls", speech.id, audioRevision],
    queryFn: async () => {
      const result = await getSpeechAudioPlayUrlsAction(speech.id);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: hasAudio && !isEditing,
    refetchInterval: (query) => {
      const expiresInSeconds = query.state.data?.expiresInSeconds ?? 3600;
      return Math.max(Math.floor(expiresInSeconds * 0.8 * 1000), 60_000);
    },
    staleTime: 30_000,
    retry: 2,
  });

  const playUrlByBlockId = useMemo(() => {
    const next: Record<string, string> = {};
    for (const item of playUrlsQuery.data?.items ?? []) {
      next[item.blockId] = item.url;
    }
    return next;
  }, [playUrlsQuery.data]);

  const playerBlocks = useMemo(() => {
    if (!currentSpeech) return [];

    return currentSpeech.blocks.map((block) => ({
      ...block,
      audioUrl: playUrlByBlockId[block.id] ?? block.audioUrl,
    }));
  }, [currentSpeech, playUrlByBlockId]);

  if (!currentSpeech) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <SpeechHeader
        speech={currentSpeech}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
      />

      {isEditing ? (
        <EditSpeechForm
          speech={currentSpeech}
          languages={languages}
          models={models}
          recommendedModel={recommendedModel}
          onDone={() => setIsEditing(false)}
        />
      ) : currentSpeech.blocks.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          У промові ще немає блоків.
        </p>
      ) : (
        <>
          {speechIsGenerating(currentSpeech) && (
            <p className="text-sm text-zinc-500">
              Генерація аудіо в процесі…
            </p>
          )}

          {playUrlsQuery.isError && hasAudio && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Не вдалося отримати play URL. Спроба відтворення з fallback URL.
            </p>
          )}

          <AudioPlayer blocks={playerBlocks} />
        </>
      )}
    </div>
  );
}
