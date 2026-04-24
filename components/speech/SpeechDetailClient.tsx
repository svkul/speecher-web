"use client";

import { useCallback, useEffect, useState } from "react";

import { AudioPlayer } from "@/components/speech/AudioPlayer";
import { GenerateAudio } from "@/components/speech/GenerateAudio";
import { SpeechBlocksList } from "@/components/speech/SpeechBlocksList";
import { ServerSpeechDetailResponse } from "@/lib/server-api";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface SpeechDetailClientProps {
  speech: ServerSpeechDetailResponse;
}

export function SpeechDetailClient({ speech }: SpeechDetailClientProps) {
  const audioPlayer = useAudioPlayer();
  const { initializePlayer, cleanup } = audioPlayer;

  const [seekTarget, setSeekTarget] = useState<{
    blockId: string;
    timeSeconds: number;
  } | null>(null);

  useEffect(() => {
    if (speech.blocks.some((block) => block.audioUrl)) {
      void initializePlayer(speech.blocks);
    }
  }, [speech.blocks, initializePlayer]);

  useEffect(() => {
    return () => {
      void cleanup();
    };
  }, [cleanup]);

  const currentPlayingBlockId =
    audioPlayer.tracks[audioPlayer.currentTrackIndex ?? -1]?.id ?? null;

  const handleSeekToLineAndPlay = useCallback(
    async (blockId: string, timeSeconds: number) => {
      setSeekTarget({ blockId, timeSeconds });
      setTimeout(() => setSeekTarget(null), 500);

      const trackIndex = audioPlayer.tracks.findIndex((track) => track.id === blockId);
      if (trackIndex < 0) return;

      if (audioPlayer.currentTrackIndex !== trackIndex) {
        await audioPlayer.playTrack(trackIndex);
      }

      await audioPlayer.seekTo(timeSeconds);
      await audioPlayer.play();
    },
    [audioPlayer],
  );

  return (
    <div className="space-y-4">
      <SpeechBlocksList
        blocks={speech.blocks}
        currentPlayingBlockId={currentPlayingBlockId}
        position={audioPlayer.progress.position}
        seekTarget={seekTarget}
        onSeekToLineAndPlay={handleSeekToLineAndPlay}
      />

      {speech.blocks.some((block) => !block.audioUrl) && (
        <GenerateAudio speechId={speech.id} />
      )}

      {speech.blocks.some((block) => block.audioUrl) && (
        <AudioPlayer controlledState={audioPlayer} />
      )}
    </div>
  );
}
