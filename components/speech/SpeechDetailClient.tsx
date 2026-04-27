"use client";

import { useQuery } from "@tanstack/react-query";

import { getSpeechClient } from "@/lib/api/client";
import type { ServerSpeechDetailResponse } from "@/lib/api/server";

import { AudioPlayer } from "@/components/audioPlayer";
import { GenerateAudio } from "./GenerateAudio";

interface SpeechDetailClientProps {
  speech: ServerSpeechDetailResponse;
}

export function SpeechDetailClient({ speech }: SpeechDetailClientProps) {
  const speechQuery = useQuery({
    queryKey: ["speech", speech.id],
    queryFn: () => getSpeechClient(speech.id),
    initialData: speech,
  });

  const currentSpeech = speechQuery.data;

  if (!currentSpeech) {
    return null;
  }

  const audioUrls = currentSpeech.blocks
    .map((block) => block.audioUrl)
    .filter((url): url is string => url !== null);

  return (
    <div className="space-y-4">
      <GenerateAudio speechId={currentSpeech.id} />

      <AudioPlayer
        speechId={currentSpeech.id}
        audioUrls={audioUrls}
        blocks={currentSpeech.blocks ?? []}
      />
    </div>
  );
}
