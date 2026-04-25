"use client";

import { ServerSpeechDetailResponse } from "@/lib/server-api";
import { AudioPlayerV2 } from "@/components/audioPlayer";

interface SpeechDetailClientProps {
  speech: ServerSpeechDetailResponse;
}

export function SpeechDetailClient({ speech }: SpeechDetailClientProps) {
  const audioUrls = speech.blocks
    .map((block) => block.audioUrl)
    .filter((url): url is string => url !== null);

  return (
    <div className="space-y-4">
      <AudioPlayerV2 audioUrls={audioUrls} />
    </div>
  );
}
