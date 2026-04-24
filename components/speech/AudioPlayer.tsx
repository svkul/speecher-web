"use client";

import { Button } from "@/components/ui/button";
import { PLAYBACK_SPEEDS, UseAudioPlayerReturn } from "@/hooks/useAudioPlayer";

interface AudioPlayerProps {
  controlledState: UseAudioPlayerReturn;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ controlledState }: AudioPlayerProps) {
  const {
    isInitialized,
    isPlaying,
    isLoading,
    currentTrackIndex,
    playbackSpeed,
    progress,
    tracks,
    audioRef,
    togglePlayPause,
    skipForward,
    skipBackward,
    setSpeed,
    nextTrack,
    previousTrack,
    seekTo,
  } = controlledState;

  if (tracks.length === 0) {
    return null;
  }

  if (!isInitialized || currentTrackIndex === null) {
    return null;
  }

  const currentTrack = tracks[currentTrackIndex] ?? null;
  const hasNext = currentTrackIndex < tracks.length - 1;
  const hasPrevious = currentTrackIndex > 0;

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3">
        <h3 className="text-base font-medium text-black dark:text-zinc-100">
          {currentTrack?.title ?? "No track selected"}
        </h3>
        {tracks.length > 1 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Track {currentTrackIndex + 1} of {tracks.length}
          </p>
        )}
      </div>

      <audio ref={audioRef} />

      <input
        type="range"
        min={0}
        max={progress.duration || 1}
        step={0.1}
        value={Math.min(progress.position, progress.duration || 0)}
        onChange={(event) => {
          const nextPosition = Number(event.target.value);
          void seekTo(nextPosition);
        }}
        className="w-full"
      />

      <div className="mb-3 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{formatTime(progress.position)}</span>
        <span>{formatTime(progress.duration)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => void skipBackward(5)} disabled={!isInitialized}>
          -5s
        </Button>

        <Button variant="outline" onClick={() => void skipBackward(3)} disabled={!isInitialized}>
          -3s
        </Button>

        <Button
          variant="outline"
          onClick={() => void previousTrack()}
          disabled={!hasPrevious}
        >
          Prev
        </Button>

        <Button onClick={() => void togglePlayPause()} disabled={!isInitialized || isLoading}>
          {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
        </Button>

        <Button
          variant="outline"
          onClick={() => void nextTrack()}
          disabled={!hasNext}
        >
          Next
        </Button>

        <Button variant="outline" onClick={() => void skipForward(3)} disabled={!isInitialized}>
          +3s
        </Button>

        <Button variant="outline" onClick={() => void skipForward(5)} disabled={!isInitialized}>
          +5s
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {PLAYBACK_SPEEDS.map((speed) => (
          <Button
            key={speed}
            variant={speed === playbackSpeed ? "default" : "outline"}
            size="sm"
            onClick={() => void setSpeed(speed)}
            disabled={!isInitialized}
          >
            {speed}x
          </Button>
        ))}
      </div>
    </div>
  );
}
